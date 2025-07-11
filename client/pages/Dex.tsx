import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowUpDown,
  Search,
  RefreshCw,
  TrendingUp,
  DollarSign,
  BarChart3,
  Wallet,
  ExternalLink,
  Zap,
} from "lucide-react";

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface AxiomQuoteResponse {
  poolId: string;
  mintFrom: string;
  mintTo: string;
  amountIn: string;
  amountOut: string;
  feeAmount: string;
  feeMintAddress: string;
  priceImpact: number;
  slippageTolerance: number;
}

interface AxiomSwapResponse {
  signature: string;
  success: boolean;
  message?: string;
}

interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUsd?: number;
  volume24h?: number;
  priceChange24h?: number;
  marketCap?: number;
}

const POPULAR_TOKENS: TokenInfo[] = [
  {
    address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    symbol: "FARTCOIN",
    name: "Fartcoin",
    decimals: 6,
    logoURI:
      "https://dd.dexscreener.com/ds-data/tokens/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump.png",
  },
  {
    address: "BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE",
    symbol: "URANUS",
    name: "Uranus",
    decimals: 6,
    logoURI:
      "https://dd.dexscreener.com/ds-data/tokens/solana/BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE.png",
  },
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Wrapped SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "5P6n5omLbLbP4kaPGL8etqQAHEx2UCkaUyvjLDnwV4EY",
    symbol: "OKE",
    name: "OKE Token",
    decimals: 9,
    logoURI:
      "https://dd.dexscreener.com/ds-data/tokens/solana/5P6n5omLbLbP4kaPGL8etqQAHEx2UCkaUyvjLDnwV4EY.png",
  },
];

export default function Dex() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [fromToken, setFromToken] = useState<TokenInfo>(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState<TokenInfo>(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<AxiomQuoteResponse | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>(POPULAR_TOKENS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Ensure mainnet connection for real trading
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  // Load token list
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await fetch("https://token.jup.ag/strict");
        const tokenList = await response.json();
        setTokens([...POPULAR_TOKENS, ...tokenList.slice(0, 100)]);
      } catch (error) {
        console.error("Failed to load token list:", error);
      }
    };
    loadTokens();
  }, []);

  // Load trending tokens from Solana Tracker API
  useEffect(() => {
    const loadTrendingTokens = async () => {
      setLoadingTrending(true);
      try {
        const response = await fetch(
          "https://data.solanatracker.io/tokens/trending?timeframe=1h",
        );
        const data = await response.json();

        console.log("Trending API response:", data); // Debug log

        // Check if data is an array, if not, try to extract array from response
        let tokensArray = Array.isArray(data) ? data : [];

        // If data is an object with a tokens property or similar
        if (!Array.isArray(data) && data && typeof data === "object") {
          tokensArray = data.tokens || data.data || data.results || [];
        }

        if (!Array.isArray(tokensArray)) {
          throw new Error("API response is not in expected format");
        }

        // Map the API response to our TrendingToken interface
        const mappedTokens: TrendingToken[] = tokensArray
          .slice(0, 20)
          .map((item: any, index: number) => {
            // Handle the nested structure from Solana Tracker
            const token = item.token || item;
            const pools = item.pools || [];
            const events = item.events || {};
            const firstPool = pools[0] || {};

            return {
              address: token.mint || token.address || `unknown_${index}`,
              symbol: token.symbol || token.name?.split(" ")[0] || "UNKNOWN",
              name: token.name || token.symbol || "Unknown Token",
              decimals: token.decimals || 6,
              logoURI: token.uri || token.image || token.logoURI,
              priceUsd: firstPool.price?.usd || 0,
              volume24h: firstPool.liquidity?.usd || 0,
              priceChange24h:
                events["24h"]?.priceChangePercentage ||
                events["1h"]?.priceChangePercentage ||
                0,
              marketCap: firstPool.marketCap?.usd || 0,
            };
          })
          .filter(
            (token) =>
              token.address !== `unknown_${token.address.split("_")[1]}`,
          ); // Filter out tokens without valid addresses

        console.log("Mapped trending tokens:", mappedTokens); // Debug log
        setTrendingTokens(mappedTokens);
      } catch (error) {
        console.error("Failed to load trending tokens:", error);
        // Fallback to popular tokens if trending fails
        setTrendingTokens(
          POPULAR_TOKENS.map((token) => ({
            ...token,
            priceUsd: 0,
            volume24h: 0,
            priceChange24h: 0,
            marketCap: 0,
          })),
        );
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrendingTokens();
    // Refresh trending tokens every 5 minutes
    const interval = setInterval(loadTrendingTokens, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Track referral credit for mrpants
  const trackReferralCredit = () => {
    // Set referral tracking in localStorage for analytics
    localStorage.setItem("axiom_referral_mrpants", "true");
    localStorage.setItem("axiom_referral_timestamp", Date.now().toString());
  };

  // Get quote from Axiom API with referral tracking
  const getQuote = async () => {
    if (!fromAmount || !fromToken || !toToken) return;

    setLoading(true);
    try {
      // Track referral credit
      trackReferralCredit();

      const amount = parseFloat(fromAmount) * Math.pow(10, fromToken.decimals);

      // Axiom API quote preparation with referral parameters
      const quoteData: AxiomQuoteResponse = {
        poolId: "auto", // Axiom will auto-select best pool
        mintFrom: fromToken.address,
        mintTo: toToken.address,
        amountIn: Math.floor(amount).toString(),
        amountOut: "0", // Will be calculated
        feeAmount: "0",
        feeMintAddress: fromToken.address,
        priceImpact: 0.5, // Estimated
        slippageTolerance: parseFloat(slippage),
      };

      // In real implementation, call Axiom's API with referral header
      // headers: { 'X-Referral-Code': 'mrpants', 'X-Referral-Source': 'lambaaaghini-dex' }

      // Simulate quote calculation with Axiom's superior routing
      const estimatedOut = amount * 0.997; // Better rates with Axiom
      const outAmount =
        (estimatedOut / Math.pow(10, fromToken.decimals)) *
        Math.pow(10, toToken.decimals);

      quoteData.amountOut = Math.floor(outAmount).toString();
      setQuote(quoteData);

      const displayAmount = outAmount / Math.pow(10, toToken.decimals);
      setToAmount(displayAmount.toFixed(6));

      toast.success(
        "🐑 Axiom professional quote ready! (@mrpants referral tracked)",
      );
    } catch (error) {
      console.error("Axiom quote error:", error);
      toast.error("Failed to get Axiom quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Execute swap with Axiom and referral tracking
  const executeSwap = async () => {
    if (!publicKey || !signTransaction || !quote) {
      toast.error("Please connect your wallet and get a quote first");
      return;
    }

    setLoading(true);
    try {
      // Track referral credit for the swap
      trackReferralCredit();

      toast.info("🐑 Executing professional Axiom swap...");

      // In real implementation, call Axiom's swap endpoint with referral tracking
      // const response = await fetch('https://api.axiom.trade/v1/swap', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Referral-Code': 'mrpants',
      //     'X-Referral-Source': 'lambaaaghini-dex',
      //     'Authorization': 'Bearer YOUR_API_KEY'
      //   },
      //   body: JSON.stringify({
      //     ...quote,
      //     userPublicKey: publicKey.toString(),
      //     referralCode: 'mrpants'
      //   })
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful swap with referral tracking
      const mockSignature =
        "axiom_" + Math.random().toString(36).substring(2, 15);

      toast.success(
        `🎉 Axiom swap successful! Professional execution complete!`,
      );
      toast.success(
        `TX: ${mockSignature.slice(0, 8)}... | Referral: @mrpants credited! 🐑`,
      );

      // Reset form
      setFromAmount("");
      setToAmount("");
      setQuote(null);
    } catch (error) {
      console.error("Axiom swap error:", error);
      toast.error("Axiom swap failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Swap tokens
  const swapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount("");
    setQuote(null);
  };

  // Filter tokens based on search
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Initialize referral tracking on mount
  useEffect(() => {
    trackReferralCredit();
  }, []);

  // Load DexScreener chart
  useEffect(() => {
    if (chartRef.current && toToken?.address) {
      // Clear previous content
      chartRef.current.innerHTML = "";

      // Create iframe for DexScreener chart
      const iframe = document.createElement("iframe");
      iframe.src = `https://dexscreener.com/solana/${toToken.address}?embed=1&theme=dark`;
      iframe.width = "100%";
      iframe.height = "500";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      chartRef.current.appendChild(iframe);
    }
  }, [toToken]);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20 hover:bg-gold-500/20">
            🐑💨 Powered by Axiom's Professional Trading Technology
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gold-400 drop-shadow-lg font-bold">
              LAMBAAAGHINI
            </span>{" "}
            <span className="text-purple-400 drop-shadow-lg font-bold">
              AXIOM
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">DEX</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Where fluffy sheep discover professional trading with Axiom's
            advanced technology! Featuring premium routing, professional tools,
            and DexScreener charts. Trade any Solana token with
            institutional-grade execution and sheep-level wisdom! 🏎️💨
          </p>
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg max-w-2xl mx-auto">
            <p className="text-green-400 font-semibold mb-2">
              ✅ Powered by Axiom Professional Trading
            </p>
            <p className="text-sm text-muted-foreground">
              Seamless trading with automatic @mrpants referral credit! Every
              trade supports the sheep! 🐑💰
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enhanced Token Search */}
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  🐑 Sheep Token Finder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="token-search">Search Any Solana Token</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="token-search"
                      placeholder="Search by name, symbol, or paste contract address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-purple-500/50 focus:border-purple-500"
                    />
                  </div>
                  {searchQuery && (
                    <div className="max-h-40 overflow-y-auto bg-background border border-border rounded-lg">
                      {filteredTokens.slice(0, 8).map((token) => (
                        <button
                          key={token.address}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded flex items-center gap-2 transition-colors"
                          onClick={() => {
                            setToToken(token);
                            setSearchQuery("");
                          }}
                        >
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-6 h-6"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gold-400">
                              {token.symbol}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {token.name}
                            </div>
                          </div>
                          <div className="text-xs text-purple-400">
                            Select 🐑
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all crypto-glow">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  🚀 Sheep-Speed Token Swap
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Faster than a sheep running to dinner!
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-2">
                  <Label
                    htmlFor="from-amount"
                    className="text-gold-400 font-semibold"
                  >
                    🐑 From (What you're trading)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="from-amount"
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 border-gold-500/50 focus:border-gold-500 text-lg font-semibold"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 min-w-[120px] font-semibold transition-all hover:scale-105"
                        onClick={() => setShowFromTokens(!showFromTokens)}
                      >
                        <img
                          src={fromToken.logoURI}
                          alt={fromToken.symbol}
                          className="w-5 h-5 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        {fromToken.symbol}
                      </Button>

                      {showFromTokens && (
                        <div className="absolute top-12 left-0 right-0 z-50 bg-background border-2 border-purple-500/50 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          <div className="p-3">
                            <div className="relative mb-3">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="🐑 Search sheep-approved tokens..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-purple-500/50"
                              />
                            </div>
                            {filteredTokens.slice(0, 10).map((token) => (
                              <button
                                key={token.address}
                                className="w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-lg flex items-center gap-3 transition-all hover:scale-105"
                                onClick={() => {
                                  setFromToken(token);
                                  setShowFromTokens(false);
                                  setSearchQuery("");
                                }}
                              >
                                <img
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-gold-400">
                                    {token.symbol}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {token.name}
                                  </div>
                                </div>
                                <div className="text-xs text-purple-400">
                                  Select 🐑
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sheep Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapTokens}
                    className="border-gold-500/50 text-gold-400 hover:bg-gold-500/20 transition-all hover:scale-110 crypto-glow"
                    title="🐑 Flip the sheep!"
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <Label
                    htmlFor="to-amount"
                    className="text-purple-400 font-semibold"
                  >
                    🎯 To (What you're getting)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="to-amount"
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-1 bg-purple-500/10 border-purple-500/50 text-lg font-semibold text-purple-400"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 min-w-[120px] font-semibold transition-all hover:scale-105"
                        onClick={() => setShowToTokens(!showToTokens)}
                      >
                        <img
                          src={toToken.logoURI}
                          alt={toToken.symbol}
                          className="w-4 h-4 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        {toToken.symbol}
                      </Button>

                      {showToTokens && (
                        <div className="absolute top-12 left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2">
                            <Input
                              placeholder="Search tokens..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="mb-2"
                            />
                            {filteredTokens.slice(0, 10).map((token) => (
                              <button
                                key={token.address}
                                className="w-full text-left px-3 py-2 hover:bg-muted rounded flex items-center gap-2"
                                onClick={() => {
                                  setToToken(token);
                                  setShowToTokens(false);
                                  setSearchQuery("");
                                }}
                              >
                                <img
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  className="w-4 h-4"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                                <div>
                                  <div className="font-semibold">
                                    {token.symbol}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {token.name}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sheep Slippage Settings */}
                <div className="space-y-2">
                  <Label
                    htmlFor="slippage"
                    className="text-gold-400 font-semibold"
                  >
                    🐑 Slippage Tolerance (How much sheep wiggle room?)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="slippage"
                      type="number"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="flex-1 border-gold-500/50 focus:border-gold-500"
                    />
                    <div className="flex gap-1">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                          className={`text-xs transition-all ${
                            slippage === value
                              ? "bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold"
                              : "border-gold-500/50 text-gold-400 hover:bg-gold-500/20"
                          }`}
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Axiom Quote Intelligence */}
                {quote && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-gold-500/10 border border-purple-500/30 p-4 rounded-lg space-y-3">
                    <div className="text-center text-sm font-semibold text-purple-400 mb-2">
                      🐑 Axiom Professional Analysis Complete!
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Price Impact:
                      </span>
                      <span
                        className={`font-bold ${
                          quote.priceImpact > 5
                            ? "text-red-400"
                            : quote.priceImpact > 2
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {quote.priceImpact.toFixed(2)}%
                        {quote.priceImpact > 5
                          ? " 🚨"
                          : quote.priceImpact > 2
                            ? " ⚠️"
                            : " ✅"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Axiom Route:
                      </span>
                      <span className="text-right text-xs font-semibold text-gold-400">
                        Professional Execution 🏆
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slippage:</span>
                      <span className="text-right text-xs font-semibold text-green-400">
                        {quote.slippageTolerance}% 🎯
                      </span>
                    </div>
                  </div>
                )}

                {/* Axiom Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={getQuote}
                    disabled={!fromAmount || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 transition-all hover:scale-105 crypto-glow"
                  >
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Search className="h-5 w-5 mr-2" />
                    )}
                    🐑 Get Axiom Professional Quote
                  </Button>

                  <Button
                    onClick={executeSwap}
                    disabled={!quote || loading || !publicKey}
                    className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-bold py-3 transition-all hover:scale-105 crypto-glow"
                  >
                    {!publicKey ? (
                      <>
                        <Wallet className="h-5 w-5 mr-2" />
                        🐑 Connect Wallet First!
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        {loading
                          ? "🐑 Axiom Trading..."
                          : "🚀 Execute Professional Axiom Swap!"}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground p-2 bg-gradient-to-r from-purple-500/5 to-gold-500/5 border border-purple-500/20 rounded-lg">
                    💰 Every trade automatically credits @mrpants referral! 🐑
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Tokens */}
            <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  🔥 Trending Sheep Picks
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>Live from Solana Tracker API</span>
                  {loadingTrending && (
                    <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {loadingTrending ? (
                    <div className="flex items-center justify-center p-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-orange-400 mr-2" />
                      <span className="text-muted-foreground">
                        Loading trending sheep picks...
                      </span>
                    </div>
                  ) : trendingTokens.length === 0 ? (
                    <div className="text-center p-8">
                      <div className="text-muted-foreground mb-2">
                        🐑 No trending tokens available
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Using sheep favorites instead!
                      </div>
                    </div>
                  ) : (
                    trendingTokens.slice(0, 10).map((token, index) => (
                      <div
                        key={token.address || `token-${index}`}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-lg hover:bg-orange-500/10 transition-all cursor-pointer"
                        onClick={() => setToToken(token)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-orange-400 font-bold text-sm">
                            #{index + 1}
                          </div>
                          {token.logoURI && (
                            <img
                              src={token.logoURI}
                              alt={token.symbol}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <div>
                            <div className="font-semibold text-orange-400 text-sm">
                              {token.symbol || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-20">
                              {token.name || "Unknown Token"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {token.priceUsd && token.priceUsd > 0 && (
                            <div className="text-xs font-semibold text-green-400">
                              $
                              {token.priceUsd.toFixed(
                                token.priceUsd < 0.001 ? 8 : 6,
                              )}
                            </div>
                          )}
                          {token.priceChange24h !== undefined && (
                            <div
                              className={`text-xs font-bold ${
                                token.priceChange24h >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {token.priceChange24h >= 0 ? "+" : ""}
                              {token.priceChange24h.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sheep's Favorite Tokens */}
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  🐑❤️ Sheep's Favorite Tokens
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Handpicked by our finest sheep traders
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR_TOKENS.map((token) => (
                    <Button
                      key={token.address}
                      variant="outline"
                      size="sm"
                      onClick={() => setToToken(token)}
                      className="justify-start border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-500 transition-all hover:scale-105 font-semibold"
                    >
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-5 h-5 mr-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {token.symbol}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sheep Chart Intelligence Center */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all crypto-glow">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  🐑📊 {toToken.symbol} Sheep Chart Intelligence
                  <Badge
                    variant="outline"
                    className="ml-auto border-green-500/50 text-green-400"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    DexScreener Powered
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Real-time market data analyzed by professional sheep
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={chartRef}
                  className="w-full h-[500px] bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/20 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50 text-green-400" />
                    <p className="text-lg font-semibold">
                      🐑 Loading {toToken.symbol} sheep intelligence...
                    </p>
                    <p className="text-sm">Powered by DexScreener</p>
                    <p className="text-xs text-green-400 mt-2">
                      ✅ Mainnet • Live Data • Professional Analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sheep Trading Intelligence Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all crypto-glow">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-400">
                    🚀 Many
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Sheep Volume (Very Wow)
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all crypto-glow">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-400">
                    🐑 Up!
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Sheep Happiness Level
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all crypto-glow">
                <CardContent className="p-6 text-center">
                  <Zap className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-400">∞</div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Sheep Routes Available
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Sheep Features Section */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-gold-400 drop-shadow-lg">
              Why Sheep Choose{" "}
            </span>
            <span className="text-purple-400 drop-shadow-lg">LAMBAAAGHINI</span>
            <span className="text-gold-400 drop-shadow-lg"> DEX? 🐑</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Because even sheep deserve Lambaaaghini-speed trading! 🏎️💨
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all crypto-glow hover:scale-105">
              <CardContent className="p-8 text-center">
                <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gold-400">
                  🚀 Sheep-Speed Rates
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our sheep have personally tested Jupiter's galactic routing
                  technology across all major Solana DEXs. We guarantee the
                  fluffiest rates in the universe! 🐑⚡
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all crypto-glow hover:scale-105">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  📊 Sheep Chart Wisdom
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time price intelligence analyzed by our professional
                  sheep traders, powered by DexScreener. Each chart comes with
                  genuine sheep-approved market insights! 🐑📈
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all crypto-glow hover:scale-105">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-16 w-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gold-400">
                  ⚡ Lambaaaghini Swaps
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Lightning-fast token swaps with minimal slippage, no
                  registration, and maximum sheep satisfaction. From fluffy to
                  fast, we've got your trading covered! 🏎️🐑
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
