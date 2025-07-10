import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export interface PumpFunTokenData {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
}

export interface CreateTokenResponse {
  signature: string;
  mint: string;
  bondingCurve: string;
  associatedBondingCurve: string;
}

export class PumpFunAPI {
  private readonly connection: Connection;
  private readonly baseUrl = "https://pumpportal.fun/api";

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Upload image to IPFS via pump.fun
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${this.baseUrl}/ipfs`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.ipfs; // Returns IPFS hash
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image to IPFS");
    }
  }

  /**
   * Upload metadata to IPFS via pump.fun
   */
  async uploadMetadata(tokenData: PumpFunTokenData): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/ipfs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tokenData.name,
          symbol: tokenData.symbol,
          description: tokenData.description,
          image: tokenData.image,
          external_url: tokenData.website,
          attributes: [],
          properties: {
            files: tokenData.image
              ? [{ uri: tokenData.image, type: "image/png" }]
              : [],
            category: "image",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Metadata upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.metadataUri;
    } catch (error) {
      console.error("Failed to upload metadata:", error);
      throw new Error("Failed to upload metadata");
    }
  }

  /**
   * Create a new token using pump.fun
   */
  async createToken(
    wallet: any,
    tokenData: PumpFunTokenData,
    initialBuyAmount?: number,
  ): Promise<CreateTokenResponse> {
    try {
      // First upload metadata if we have all required data
      let metadataUri = "";
      if (tokenData.image) {
        metadataUri = await this.uploadMetadata(tokenData);
      }

      // Prepare the create token request
      const createRequest = {
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description,
        imageUrl: tokenData.image,
        options: {
          twitter: tokenData.twitter,
          telegram: tokenData.telegram,
          website: tokenData.website,
        },
        initialBuy: initialBuyAmount || 0,
        slippageBps: 500, // 5% slippage
        priorityFee: 0.0001,
        pool: "pump", // Use pump.fun pool
      };

      // Get the transaction from pump.fun API
      const response = await fetch(`${this.baseUrl}/trade-local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      });

      if (!response.ok) {
        throw new Error(`Token creation failed: ${response.statusText}`);
      }

      const data = await response.json();

      // The response should contain a transaction that we need to sign
      if (data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(data.transaction, "base64"),
        );
        const signature = await wallet.signAndSendTransaction(transaction);

        return {
          signature,
          mint: data.mint,
          bondingCurve: data.bondingCurve,
          associatedBondingCurve: data.associatedBondingCurve,
        };
      }

      throw new Error("No transaction returned from API");
    } catch (error) {
      console.error("Failed to create token:", error);
      throw error;
    }
  }

  /**
   * Get token information from pump.fun
   */
  async getTokenInfo(mintAddress: string) {
    try {
      const response = await fetch(`${this.baseUrl}/tokens/${mintAddress}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get token info:", error);
      throw error;
    }
  }

  /**
   * Buy tokens from pump.fun bonding curve
   */
  async buyToken(
    wallet: any,
    mintAddress: string,
    solAmount: number,
    slippageBps: number = 500,
  ) {
    try {
      const buyRequest = {
        publicKey: wallet.publicKey.toString(),
        action: "buy",
        mint: mintAddress,
        amount: solAmount,
        denominatedInSol: "true",
        slippage: slippageBps,
        priorityFee: 0.0001,
        pool: "pump",
      };

      const response = await fetch(`${this.baseUrl}/trade-local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyRequest),
      });

      if (!response.ok) {
        throw new Error(`Buy failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(data.transaction, "base64"),
        );
        return await wallet.signAndSendTransaction(transaction);
      }

      throw new Error("No transaction returned from buy API");
    } catch (error) {
      console.error("Failed to buy token:", error);
      throw error;
    }
  }

  /**
   * Sell tokens on pump.fun bonding curve
   */
  async sellToken(
    wallet: any,
    mintAddress: string,
    tokenAmount: number,
    slippageBps: number = 500,
  ) {
    try {
      const sellRequest = {
        publicKey: wallet.publicKey.toString(),
        action: "sell",
        mint: mintAddress,
        amount: tokenAmount,
        denominatedInSol: "false",
        slippage: slippageBps,
        priorityFee: 0.0001,
        pool: "pump",
      };

      const response = await fetch(`${this.baseUrl}/trade-local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellRequest),
      });

      if (!response.ok) {
        throw new Error(`Sell failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(data.transaction, "base64"),
        );
        return await wallet.signAndSendTransaction(transaction);
      }

      throw new Error("No transaction returned from sell API");
    } catch (error) {
      console.error("Failed to sell token:", error);
      throw error;
    }
  }
}

// Utility function to create PumpFun API instance
export function createPumpFunAPI(rpcUrl?: string): PumpFunAPI {
  const connection = new Connection(
    rpcUrl || "https://api.mainnet-beta.solana.com",
  );
  return new PumpFunAPI(connection);
}

// Token validation utilities
export function validateTokenData(tokenData: PumpFunTokenData): string[] {
  const errors: string[] = [];

  if (!tokenData.name || tokenData.name.trim().length === 0) {
    errors.push("Token name is required");
  }

  if (!tokenData.symbol || tokenData.symbol.trim().length === 0) {
    errors.push("Token symbol is required");
  }

  if (tokenData.symbol && tokenData.symbol.length > 10) {
    errors.push("Token symbol must be 10 characters or less");
  }

  if (!tokenData.description || tokenData.description.trim().length === 0) {
    errors.push("Token description is required");
  }

  if (tokenData.description && tokenData.description.length > 1000) {
    errors.push("Token description must be 1000 characters or less");
  }

  return errors;
}
