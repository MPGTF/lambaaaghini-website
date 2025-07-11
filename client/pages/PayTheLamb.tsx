import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Crown,
  Star,
  Timer,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Wallet,
  Send,
  Clock,
  Zap,
  Trophy,
} from "lucide-react";
import FeaturedTokens from "@/components/FeaturedTokens";

interface FeaturedToken {
  id: string;
  contractAddress: string;
  symbol: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  featuredUntil: number;
  paidAmount: number;
  submittedBy: string;
  timeRemaining?: string;
}

const FEATURE_FEE = 0.5; // SOL
const LAMB_WALLET_ADDRESS = "F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966";

export default function PayTheLamb() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [featuredTokens, setFeaturedTokens] = useState<FeaturedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractAddress: "",
    symbol: "",
    name: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    twitterUrl: "",
    telegramUrl: "",
  });

  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  // Load featured tokens from localStorage on mount
  useEffect(() => {
    const loadFeaturedTokens = () => {
      const stored = localStorage.getItem("lamb_featured_tokens");
      if (stored) {
        const tokens: FeaturedToken[] = JSON.parse(stored);
        // Filter out expired tokens
        const now = Date.now();
        const activeTokens = tokens.filter(
          (token) => token.featuredUntil > now,
        );

        // Update time remaining for each token
        const tokensWithTime = activeTokens.map((token) => ({
          ...token,
          timeRemaining: getTimeRemaining(token.featuredUntil),
        }));

        setFeaturedTokens(tokensWithTime);

        // Save back the filtered active tokens
        localStorage.setItem(
          "lamb_featured_tokens",
          JSON.stringify(activeTokens),
        );
      }
    };

    loadFeaturedTokens();

    // Update every minute
    const interval = setInterval(loadFeaturedTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (featuredUntil: number): string => {
    const now = Date.now();
    const remaining = featuredUntil - now;

    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.contractAddress.trim()) {
      toast.error("Contract address is required!");
      return false;
    }
    if (!formData.symbol.trim()) {
      toast.error("Token symbol is required!");
      return false;
    }
    if (!formData.name.trim()) {
      toast.error("Token name is required!");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Token description is required!");
      return false;
    }
    if (!formData.logoUrl.trim()) {
      toast.error("Logo URL is required!");
      return false;
    }
    return true;
  };

  const submitForFeaturing = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      toast.info("🐑 Preparing payment to the Lamb...");

      // Create transaction to send 0.5 SOL to the Lamb wallet
      const lambWalletPubkey = new PublicKey(LAMB_WALLET_ADDRESS);
      const lamports = FEATURE_FEE * 1000000000; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: lambWalletPubkey,
          lamports,
        }),
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      // Create featured token entry
      const newFeaturedToken: FeaturedToken = {
        id: signature,
        contractAddress: formData.contractAddress,
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        description: formData.description,
        logoUrl: formData.logoUrl,
        websiteUrl: formData.websiteUrl,
        twitterUrl: formData.twitterUrl,
        telegramUrl: formData.telegramUrl,
        featuredUntil: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        paidAmount: FEATURE_FEE,
        submittedBy: publicKey.toString(),
        timeRemaining: "24h 0m",
      };

      // Save to localStorage
      const existing = JSON.parse(
        localStorage.getItem("lamb_featured_tokens") || "[]",
      );
      const updated = [newFeaturedToken, ...existing];
      localStorage.setItem("lamb_featured_tokens", JSON.stringify(updated));

      // Update state
      setFeaturedTokens((prev) => [newFeaturedToken, ...prev]);

      // Reset form
      setFormData({
        contractAddress: "",
        symbol: "",
        name: "",
        description: "",
        logoUrl: "",
        websiteUrl: "",
        twitterUrl: "",
        telegramUrl: "",
      });

      toast.success("🎉 Token featured successfully! The Lamb is pleased!");
      toast.success(
        `TX: ${signature.slice(0, 8)}... | Featured for 24 hours! 🐑👑`,
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
            🐑👑 Don't Pay DEX, Pay the Lamb - Premium Token Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-purple-400 drop-shadow-lg font-bold">
              PAY THE
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">LAMB</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Skip the DEX fees and feature your token directly with the Lamb! Pay
            0.5 SOL for 24-hour premium placement and let the sheep community
            discover your project! 🐑💰
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500/10 to-gold-500/10 border border-purple-500/20 rounded-lg p-6">
              <Crown className="h-8 w-8 text-gold-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gold-400 mb-2">
                Premium Placement
              </h3>
              <p className="text-sm text-muted-foreground">
                Top visibility for 24 hours on our platform
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-400 mb-2">
                Fair Price
              </h3>
              <p className="text-sm text-muted-foreground">
                Only 0.5 SOL - No hidden fees or subscriptions
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-orange-400 mb-2">
                Sheep Approved
              </h3>
              <p className="text-sm text-muted-foreground">
                Direct access to our growing sheep community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Token Form */}
          <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Send className="h-5 w-5" />
                🐑 Submit Your Token for Featuring
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Pay 0.5 SOL directly to the Lamb for 24-hour premium placement!
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="contract"
                    className="text-purple-400 font-semibold"
                  >
                    🏷️ Contract Address *
                  </Label>
                  <Input
                    id="contract"
                    placeholder="Enter your token's contract address..."
                    value={formData.contractAddress}
                    onChange={(e) =>
                      handleInputChange("contractAddress", e.target.value)
                    }
                    className="border-purple-500/50 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="symbol"
                      className="text-gold-400 font-semibold"
                    >
                      🎯 Token Symbol *
                    </Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., LAMB"
                      value={formData.symbol}
                      onChange={(e) =>
                        handleInputChange("symbol", e.target.value)
                      }
                      className="border-gold-500/50 focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gold-400 font-semibold"
                    >
                      📛 Token Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., LambCoin"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="border-gold-500/50 focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-green-400 font-semibold"
                  >
                    📝 Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell the sheep community about your token..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="border-green-500/50 focus:border-green-500 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="logo"
                    className="text-orange-400 font-semibold"
                  >
                    🖼️ Logo URL *
                  </Label>
                  <Input
                    id="logo"
                    placeholder="https://your-logo-url.com/logo.png"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      handleInputChange("logoUrl", e.target.value)
                    }
                    className="border-orange-500/50 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-blue-400 font-semibold">
                    🔗 Social Links (Optional)
                  </Label>

                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="🌐 Website URL"
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        handleInputChange("websiteUrl", e.target.value)
                      }
                      className="border-blue-500/50 focus:border-blue-500"
                    />
                    <Input
                      placeholder="🐦 Twitter URL"
                      value={formData.twitterUrl}
                      onChange={(e) =>
                        handleInputChange("twitterUrl", e.target.value)
                      }
                      className="border-blue-500/50 focus:border-blue-500"
                    />
                    <Input
                      placeholder="📱 Telegram URL"
                      value={formData.telegramUrl}
                      onChange={(e) =>
                        handleInputChange("telegramUrl", e.target.value)
                      }
                      className="border-blue-500/50 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gold-500/10 to-orange-500/10 border border-gold-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gold-400">
                      🐑 Payment to the Lamb:
                    </span>
                    <span className="text-2xl font-bold text-gold-400">
                      {FEATURE_FEE} SOL
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    💰 Direct payment to:{" "}
                    <code className="text-xs bg-black/20 px-1 rounded">
                      {LAMB_WALLET_ADDRESS}
                    </code>
                  </div>
                  <div className="text-sm text-gold-400 mt-2">
                    ⏰ Your token will be featured for exactly 24 hours!
                  </div>
                </div>

                <Button
                  onClick={submitForFeaturing}
                  disabled={loading || !connected}
                  className="w-full bg-gradient-to-r from-purple-500 to-gold-600 hover:from-purple-600 hover:to-gold-700 text-white font-bold py-3 transition-all hover:scale-105"
                >
                  {!connected ? (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      🐑 Connect Wallet First!
                    </>
                  ) : loading ? (
                    <>
                      <Clock className="h-5 w-5 animate-spin mr-2" />
                      🐑 Paying the Lamb...
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 mr-2" />
                      👑 Pay the Lamb & Feature Token!
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Tokens Display */}
          <FeaturedTokens showTitle={true} maxTokens={10} className="" />
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-purple-400 drop-shadow-lg">How</span>{" "}
            <span className="text-gold-400 drop-shadow-lg">Pay the Lamb</span>{" "}
            <span className="text-purple-400 drop-shadow-lg">Works</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Simple, transparent, and sheep-approved! 🐑
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  📝 Submit Details
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fill out your token information, including contract address,
                  description, and social links.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-400">
                  💰 Pay the Lamb
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send exactly 0.5 SOL directly to the Lamb's wallet. No
                  middlemen, no hidden fees!
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-400">
                  🚀 Get Featured
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your token appears instantly in the featured section with
                  premium visibility!
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-gold-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-gold-400">4</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gold-400">
                  ⏰ 24 Hours Fame
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enjoy full 24 hours of premium placement and sheep community
                  exposure!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
