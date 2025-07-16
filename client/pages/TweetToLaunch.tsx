import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Twitter,
  Rocket,
  Image,
  CheckCircle,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Copy,
  ExternalLink,
  Zap,
  TrendingUp,
} from "lucide-react";

interface MonitorStatus {
  isMonitoring: boolean;
  processedTweetsCount: number;
  message?: string;
}

interface ParseResult {
  success: boolean;
  input: string;
  parsed: { name: string; symbol: string } | null;
  isValid: boolean;
}

export default function TweetToLaunch() {
  const [monitorStatus, setMonitorStatus] = useState<MonitorStatus>({
    isMonitoring: false,
    processedTweetsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testTweet, setTestTweet] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [manualLaunch, setManualLaunch] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
  });

  // Fetch monitoring status
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/tweet-launch/status");
      const data = await response.json();
      setMonitorStatus(data);
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  const startMonitoring = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tweet-launch/start-monitoring", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("🐑 Twitter monitoring started!");
        setMonitorStatus(data.status);
      } else {
        toast.error("Failed to start monitoring: " + data.error);
      }
    } catch (error) {
      toast.error("Failed to start monitoring");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopMonitoring = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tweet-launch/stop-monitoring", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("🛑 Twitter monitoring stopped");
        setMonitorStatus({ isMonitoring: false, processedTweetsCount: 0 });
      } else {
        toast.error("Failed to stop monitoring: " + data.error);
      }
    } catch (error) {
      toast.error("Failed to stop monitoring");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const testParsing = async () => {
    if (!testTweet.trim()) return;

    try {
      const response = await fetch("/api/tweet-launch/test-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetText: testTweet }),
      });
      const data = await response.json();
      setParseResult(data);
    } catch (error) {
      toast.error("Failed to test parsing");
      console.error(error);
    }
  };

  const manualTokenLaunch = async () => {
    if (!manualLaunch.name || !manualLaunch.symbol) {
      toast.error("Name and symbol are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tweet-launch/manual-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualLaunch),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(
          `🎉 Token ${manualLaunch.symbol} launched! Contract: ${data.mintAddress}`,
        );
        setManualLaunch({
          name: "",
          symbol: "",
          description: "",
          imageUrl: "",
        });
      } else {
        toast.error("Launch failed: " + data.error);
      }
    } catch (error) {
      toast.error("Failed to launch token");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">
          🐑
        </div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">
          🚗
        </div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-spin-slow">
          💨
        </div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce">
          🚀
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/lamb-car.png"
              alt="LAMBAAAGHINI"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              Tweet-to-Launch
            </h1>
            <Twitter className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            🐑 Launch tokens instantly by tweeting! Just mention us with your
            token name and ticker, and we'll deploy it automatically on
            pump.fun! 🚗💨
          </p>
        </div>

        {/* Monitoring Status */}
        <Card className="mb-8 border-2 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge
                  variant={monitorStatus.isMonitoring ? "default" : "secondary"}
                  className="text-sm"
                >
                  {monitorStatus.isMonitoring ? "🟢 Active" : "🔴 Inactive"}
                </Badge>
                <span className="text-sm text-gray-600">
                  Processed: {monitorStatus.processedTweetsCount} tweets
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={startMonitoring}
                  disabled={isLoading || monitorStatus.isMonitoring}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                <Button
                  onClick={stopMonitoring}
                  disabled={isLoading || !monitorStatus.isMonitoring}
                  size="sm"
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
            {monitorStatus.message && (
              <p className="text-sm text-gray-600">{monitorStatus.message}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* How to Use */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                How to Launch a Token
              </CardTitle>
              <CardDescription>
                Follow these simple steps to launch your token via Twitter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800">1</Badge>
                  <div>
                    <p className="font-medium">Tweet the Format</p>
                    <p className="text-sm text-gray-600">
                      Tweet: "TOKEN NAME + TICKER" and mention
                      @YourTwitterHandle
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800">2</Badge>
                  <div>
                    <p className="font-medium">Add an Image (Optional)</p>
                    <p className="text-sm text-gray-600">
                      Attach an image to use as your token logo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800">3</Badge>
                  <div>
                    <p className="font-medium">Get Your Token</p>
                    <p className="text-sm text-gray-600">
                      We'll reply with your contract address and trading links!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">
                  📝 Example Tweets:
                </h4>
                <div className="space-y-2 text-sm">
                  <div
                    className="bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => copyToClipboard("Super Sheep + SHEEP")}
                  >
                    <code>"Super Sheep + SHEEP"</code>
                    <Copy className="w-3 h-3 inline ml-2 text-gray-400" />
                  </div>
                  <div
                    className="bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => copyToClipboard("Moon Lambs $MLAMB")}
                  >
                    <code>"Moon Lambs $MLAMB"</code>
                    <Copy className="w-3 h-3 inline ml-2 text-gray-400" />
                  </div>
                  <div
                    className="bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => copyToClipboard("Fast Cars FCAR")}
                  >
                    <code>"Fast Cars FCAR"</code>
                    <Copy className="w-3 h-3 inline ml-2 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Parser */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Test Your Tweet
              </CardTitle>
              <CardDescription>
                Test if your tweet format will work before posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-tweet">Enter your tweet text:</Label>
                <Textarea
                  id="test-tweet"
                  value={testTweet}
                  onChange={(e) => setTestTweet(e.target.value)}
                  placeholder="Super Sheep + SHEEP"
                  className="mt-1"
                />
              </div>

              <Button onClick={testParsing} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Parse
              </Button>

              {parseResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    parseResult.isValid
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {parseResult.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">
                      {parseResult.isValid ? "Valid Format!" : "Invalid Format"}
                    </span>
                  </div>

                  {parseResult.parsed && (
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Token Name:</strong> {parseResult.parsed.name}
                      </p>
                      <p>
                        <strong>Symbol:</strong> {parseResult.parsed.symbol}
                      </p>
                    </div>
                  )}

                  {!parseResult.isValid && (
                    <p className="text-sm text-red-600 mt-2">
                      Use format: "TOKEN NAME + TICKER" or "TOKEN NAME $TICKER"
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manual Launch for Testing */}
        <Card className="border-2 border-purple-200 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Manual Token Launch (Admin)
            </CardTitle>
            <CardDescription>
              Launch tokens manually for testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual-name">Token Name</Label>
                <Input
                  id="manual-name"
                  value={manualLaunch.name}
                  onChange={(e) =>
                    setManualLaunch({ ...manualLaunch, name: e.target.value })
                  }
                  placeholder="Super Sheep"
                />
              </div>
              <div>
                <Label htmlFor="manual-symbol">Symbol</Label>
                <Input
                  id="manual-symbol"
                  value={manualLaunch.symbol}
                  onChange={(e) =>
                    setManualLaunch({
                      ...manualLaunch,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SHEEP"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="manual-description">Description</Label>
              <Textarea
                id="manual-description"
                value={manualLaunch.description}
                onChange={(e) =>
                  setManualLaunch({
                    ...manualLaunch,
                    description: e.target.value,
                  })
                }
                placeholder="Amazing token description..."
              />
            </div>

            <div>
              <Label htmlFor="manual-image">Image URL (Optional)</Label>
              <Input
                id="manual-image"
                value={manualLaunch.imageUrl}
                onChange={(e) =>
                  setManualLaunch({ ...manualLaunch, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.png"
              />
            </div>

            <Button
              onClick={manualTokenLaunch}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isLoading ? "Launching..." : "Launch Token"}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            🐑 Powered by LAMBAAAGHINI - Where Sheep Meet Supercars! 🚗
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a
              href="https://pump.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              Pump.fun <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://dexscreener.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              DexScreener <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
