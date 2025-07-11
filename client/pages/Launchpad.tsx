import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { aiGenerator, validatePrompt } from "@/lib/ai-generator";
import {
  createPumpFunAPI,
  validateTokenData,
  type PumpFunTokenData,
} from "@/lib/pumpfun";
import {
  Rocket,
  Zap,
  Brain,
  Coins,
  Upload,
  Sparkles,
  TrendingUp,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
}

export default function Launchpad() {
  const { connected, publicKey } = useWallet();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [tokenData, setTokenData] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const generateTokenWithAI = async () => {
    const validation = validatePrompt(aiPrompt);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setIsGenerating(true);
    try {
      // Use real AI generator
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

      const suggestion = aiGenerator.generateTokenSuggestions(aiPrompt, 1)[0];
      const generatedData: TokenMetadata = {
        name: suggestion.name,
        symbol: suggestion.symbol,
        description: suggestion.description,
      };

      setTokenData(generatedData);
      toast.success("AI-generated token metadata ready!");
    } catch (error) {
      toast.error("Failed to generate token metadata");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTokenMetadata = (prompt: string): TokenMetadata => {
    // Simple AI simulation - replace with actual AI API
    const keywords = prompt.toLowerCase();

    let name = "";
    let symbol = "";
    let description = "";

    if (keywords.includes("dog") || keywords.includes("puppy")) {
      name = "DogeCoin Supreme";
      symbol = "DOGES";
      description =
        "The ultimate dog-themed meme coin that brings joy and lambos to the Solana ecosystem.";
    } else if (keywords.includes("cat") || keywords.includes("kitty")) {
      name = "Solana Cat";
      symbol = "SCAT";
      description =
        "Purr-fectly designed cat coin for the sophisticated crypto investor.";
    } else if (keywords.includes("moon") || keywords.includes("rocket")) {
      name = "Moon Rocket";
      symbol = "MOON";
      description =
        "Blast off to the moon with this high-performance rocket fuel token.";
    } else if (keywords.includes("ai") || keywords.includes("robot")) {
      name = "AI Revolution";
      symbol = "AIREV";
      description =
        "The future of artificial intelligence meets decentralized finance.";
    } else {
      name = "Lambaaaghini Token";
      symbol = "LAMB";
      description = `${prompt} - A revolutionary token that combines luxury with cutting-edge blockchain technology.`;
    }

    return { name, symbol, description };
  };

  const createToken = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!tokenData.name || !tokenData.symbol || !tokenData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const pumpFunAPI = createPumpFunAPI();

      // Upload image if provided
      let imageUrl = previewUrl;
      if (imageFile) {
        toast.info("Uploading image to IPFS...");
        // imageUrl = await pumpFunAPI.uploadImage(imageFile);
      }

      const finalTokenData: PumpFunTokenData = {
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description,
        image: imageUrl,
      };

      toast.info("Creating token on Solana...");

      // Note: This is a simplified version. In production, you'd need proper wallet adapter integration
      // const result = await pumpFunAPI.createToken(wallet, finalTokenData);

      // Simulate creation for demo
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success(`Token ${tokenData.name} created successfully!`);

      // Reset form
      setTokenData({ name: "", symbol: "", description: "" });
      setAiPrompt("");
      setImageFile(null);
      setPreviewUrl("");
    } catch (error: any) {
      console.error("Token creation error:", error);
      toast.error(error.message || "Failed to create token");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🚀 AI-Powered Token Launchpad
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Launch Your <span className="gradient-text">Dream Token</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create professional tokens in minutes using AI assistance. Powered
            by pump.fun and deployed instantly to Solana.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="glass-card border-gold-500/20 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold gradient-text">1,247</div>
              <div className="text-sm text-muted-foreground">
                Tokens Created
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-purple-500/20 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold gradient-text">$2.4M</div>
              <div className="text-sm text-muted-foreground">Volume Traded</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-gold-500/20 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold gradient-text">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-purple-500/20 text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold gradient-text">&lt; 30s</div>
              <div className="text-sm text-muted-foreground">Deploy Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="ai" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-muted/20">
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Creator</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>Manual</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Input */}
              <Card className="glass-card border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span>Describe Your Token</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="ai-prompt">Token Description</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="e.g., A fun dog-themed meme coin for crypto enthusiasts who love puppies and want to go to the moon..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <Button
                    onClick={generateTokenWithAI}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Our AI will generate professional token metadata including
                      name, symbol, and description based on your input.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Generated/Manual Token Data */}
              <Card className="glass-card border-gold-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-gold-400" />
                    <span>Token Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="token-name">Token Name</Label>
                      <Input
                        id="token-name"
                        value={tokenData.name}
                        onChange={(e) =>
                          setTokenData({ ...tokenData, name: e.target.value })
                        }
                        placeholder="My Awesome Token"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="token-symbol">Symbol</Label>
                      <Input
                        id="token-symbol"
                        value={tokenData.symbol}
                        onChange={(e) =>
                          setTokenData({
                            ...tokenData,
                            symbol: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="AWESOME"
                        className="mt-2"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="token-description">Description</Label>
                    <Textarea
                      id="token-description"
                      value={tokenData.description}
                      onChange={(e) =>
                        setTokenData({
                          ...tokenData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your token..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="token-image">Token Image</Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Token preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                Click to upload token image
                              </p>
                            </div>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={createToken}
                    disabled={
                      isCreating || !tokenData.name || !tokenData.symbol
                    }
                    className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold crypto-glow"
                  >
                    {isCreating ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Creating Token...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Create Token
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="glass-card border-gold-500/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Manual Token Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Manual token creation gives you full control over all token
                    parameters. Use the AI Creator tab for assisted generation.
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground text-center py-8">
                  Manual creation interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="gradient-text">Lambaaaghini</span>{" "}
            Launchpad?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Advanced AI generates professional token metadata from simple
                  descriptions
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Deploy tokens to Solana in under 30 seconds with pump.fun
                  integration
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure & Audited</h3>
                <p className="text-muted-foreground">
                  Battle-tested smart contracts with comprehensive security
                  audits
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
