import { Keypair, Connection, VersionedTransaction } from "@solana/web3.js";
import FormData from "form-data";
import axios from "axios";

interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  imageBuffer?: Buffer;
  imageName?: string;
}

interface LaunchResult {
  success: boolean;
  mintAddress?: string;
  signature?: string;
  error?: string;
}

export class TokenLaunchService {
  private connection: Connection;
  private wallet: Keypair;

  constructor(rpcUrl: string, privateKey: Uint8Array) {
    this.connection = new Connection(rpcUrl, "confirmed");
    this.wallet = Keypair.fromSecretKey(privateKey);
  }

  /**
   * Upload metadata to IPFS via pump.fun
   */
  async uploadMetadataToIPFS(metadata: TokenMetadata): Promise<string> {
    const formData = new FormData();

    // Add image if provided
    if (metadata.imageBuffer && metadata.imageName) {
      formData.append("file", metadata.imageBuffer, {
        filename: metadata.imageName,
        contentType: "image/png",
      });
    } else {
      // Use default LAMBAAAGHINI image if no image provided
      const defaultImageBuffer = Buffer.from(""); // We'll add a default image later
      formData.append("file", defaultImageBuffer, {
        filename: "default.png",
        contentType: "image/png",
      });
    }

    formData.append("name", metadata.name);
    formData.append("symbol", metadata.symbol);
    formData.append(
      "description",
      metadata.description ||
        `${metadata.name} - Launched via LAMBAAAGHINI Tweet-to-Launch! 🐑🚗`,
    );
    formData.append("website", metadata.website || "https://lambaaaghini.com");
    formData.append("twitter", metadata.twitter || "");
    formData.append("telegram", metadata.telegram || "");
    formData.append("showName", "true");

    try {
      const response = await axios.post("https://pump.fun/api/ipfs", formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
      });

      return response.data.metadataUri;
    } catch (error: any) {
      console.error("Failed to upload metadata to IPFS:", error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  /**
   * Create token via pump.fun API
   */
  async createToken(
    metadata: TokenMetadata,
    devBuyAmount: number = 0.01,
  ): Promise<LaunchResult> {
    try {
      // Generate mint keypair
      const mintKeypair = Keypair.generate();

      // Upload metadata to IPFS
      const metadataUri = await this.uploadMetadataToIPFS(metadata);

      // Create token via PumpSwapApi
      const response = await axios.post(
        "https://pumpswapapi.fun/api/create/create-local",
        {
          publicKey: this.wallet.publicKey.toString(),
          mint: mintKeypair.publicKey.toString(),
          metadata: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadataUri,
          },
          devBuy: devBuyAmount,
          priorityFee: 0.0001,
          slippage: 1,
        },
      );

      const { transaction: serializedTransaction } = response.data;

      // Deserialize and sign transaction
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(serializedTransaction, "base64"),
      );

      transaction.sign([this.wallet, mintKeypair]);

      // Send transaction
      const signature = await this.connection.sendTransaction(transaction, {
        maxRetries: 3,
      });

      // Confirm transaction
      await this.connection.confirmTransaction(signature, "confirmed");

      console.log("Token created successfully:", {
        mintAddress: mintKeypair.publicKey.toString(),
        signature,
        name: metadata.name,
        symbol: metadata.symbol,
      });

      return {
        success: true,
        mintAddress: mintKeypair.publicKey.toString(),
        signature,
      };
    } catch (error: any) {
      console.error("Token creation failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Parse tweet content to extract token name and symbol
   */
  static parseTweetForToken(
    tweetText: string,
  ): { name: string; symbol: string } | null {
    // Remove mentions, hashtags, and URLs for cleaner parsing
    const cleanText = tweetText
      .replace(/@\w+/g, "")
      .replace(/#\w+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    // Look for pattern: "TOKEN NAME + TICKER" or "TOKEN NAME $TICKER"
    const patterns = [
      /^(.+?)\s*\+\s*([A-Z]{2,10})$/i,
      /^(.+?)\s*\$([A-Z]{2,10})$/i,
      /^(.+?)\s+([A-Z]{2,10})$/i,
    ];

    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const name = match[1].trim();
        const symbol = match[2].trim().toUpperCase();

        // Validate name and symbol
        if (
          name.length > 0 &&
          name.length <= 32 &&
          symbol.length >= 2 &&
          symbol.length <= 10
        ) {
          return { name, symbol };
        }
      }
    }

    return null;
  }

  /**
   * Extract image from tweet media
   */
  static async extractImageFromTweet(
    mediaUrl: string,
  ): Promise<{ buffer: Buffer; name: string } | null> {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
      });

      const buffer = Buffer.from(response.data);
      const name = `token-image-${Date.now()}.png`;

      return { buffer, name };
    } catch (error) {
      console.error("Failed to extract image from tweet:", error);
      return null;
    }
  }
}
