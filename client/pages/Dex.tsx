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

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: any[];
}

const POPULAR_TOKENS: TokenInfo[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Wrapped SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
  },
  {
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade Staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
];

export default function Dex() {
  const { publicKey, signTransaction } = useWallet();
  const [fromToken, setFromToken] = useState<TokenInfo>(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState<TokenInfo>(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>(POPULAR_TOKENS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const chartRef = useRef<HTMLDivElement>(null);

  const connection = new Connection("https://api.mainnet-beta.solana.com");

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

  // Get quote from Jupiter
  const getQuote = async () => {
    if (!fromAmount || !fromToken || !toToken) return;

    setLoading(true);
    try {
      const amount = parseFloat(fromAmount) * Math.pow(10, fromToken.decimals);
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${Math.floor(amount)}&slippageBps=${Math.floor(parseFloat(slippage) * 100)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to get quote");
      }

      const quoteData = await response.json();
      setQuote(quoteData);

      const outAmount =
        parseInt(quoteData.outAmount) / Math.pow(10, toToken.decimals);
      setToAmount(outAmount.toFixed(6));
    } catch (error) {
      console.error("Quote error:", error);
      toast.error("Failed to get quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!publicKey || !signTransaction || !quote) {
      toast.error("Please connect your wallet and get a quote first");
      return;
    }

    setLoading(true);
    try {
      // Get swap transaction
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
        }),
      });

      const { swapTransaction } = await response.json();

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      toast.success(`🎉 Swap successful! TX: ${signature.slice(0, 8)}...`);

      // Reset form
      setFromAmount("");
      setToAmount("");
      setQuote(null);
    } catch (error) {
      console.error("Swap error:", error);
      toast.error("Swap failed. Please try again.");
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
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🐑⚡ Professional Sheep Trading Terminal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gold-400 font-bold">LAMBAAAGHINI</span>{" "}
            <span className="text-purple-400 font-bold">DEX</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powered by Jupiter's advanced routing technology and DexScreener
            charts. Trade any Solana token with the best rates and lowest
            slippage, guided by sheep wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Instant Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-2">
                  <Label htmlFor="from-amount">From</Label>
                  <div className="flex gap-2">
                    <Input
                      id="from-amount"
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 min-w-[100px]"
                        onClick={() => setShowFromTokens(!showFromTokens)}
                      >
                        <img
                          src={fromToken.logoURI}
                          alt={fromToken.symbol}
                          className="w-4 h-4 mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        {fromToken.symbol}
                      </Button>

                      {showFromTokens && (
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
                                  setFromToken(token);
                                  setShowFromTokens(false);
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

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapTokens}
                    className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <Label htmlFor="to-amount">To</Label>
                  <div className="flex gap-2">
                    <Input
                      id="to-amount"
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-1 bg-muted"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 min-w-[100px]"
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

                {/* Slippage Settings */}
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slippage"
                      type="number"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex gap-1">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                          className="text-xs"
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote Info */}
                {quote && (
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price Impact:</span>
                      <span
                        className={`font-semibold ${
                          parseFloat(quote.priceImpactPct) > 5
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {(parseFloat(quote.priceImpactPct) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Route:</span>
                      <span className="text-right text-xs">
                        {quote.routePlan?.length || 1} hop
                        {quote.routePlan?.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={getQuote}
                    disabled={!fromAmount || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Get Quote
                  </Button>

                  <Button
                    onClick={executeSwap}
                    disabled={!quote || loading || !publicKey}
                    className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
                  >
                    {!publicKey ? (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        {loading ? "Swapping..." : "Execute Swap"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tokens */}
            <Card className="glass-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Popular Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_TOKENS.map((token) => (
                    <Button
                      key={token.address}
                      variant="outline"
                      size="sm"
                      onClick={() => setToToken(token)}
                      className="justify-start border-muted hover:bg-muted"
                    >
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-4 h-4 mr-2"
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

          {/* Chart Area */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {toToken.symbol} Chart
                  <Badge variant="outline" className="ml-auto">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    DexScreener
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={chartRef}
                  className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center"
                >
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Loading {toToken.symbol} chart...</p>
                    <p className="text-sm">Powered by DexScreener</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="glass-card border-blue-500/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">$2.1M</div>
                  <div className="text-sm text-muted-foreground">
                    24h Volume
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">
                    +12.5%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    24h Change
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">156</div>
                  <div className="text-sm text-muted-foreground">
                    Routes Available
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="text-gold-400">Why Trade with </span>
            <span className="text-purple-400">LAMBAAAGHINI DEX?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Best Rates</h3>
                <p className="text-muted-foreground">
                  Jupiter aggregates liquidity from all major Solana DEXs to
                  find you the best possible rates
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Charts</h3>
                <p className="text-muted-foreground">
                  Real-time price charts and market data powered by DexScreener
                  for informed trading decisions
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardContent className="p-6 text-center">
                <RefreshCw className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Instant Swaps</h3>
                <p className="text-muted-foreground">
                  Lightning-fast token swaps with minimal slippage and no
                  registration required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
