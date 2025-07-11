import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Rocket,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        {/* Meme-serious gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-background to-amber-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,20,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]" />

        {/* Floating Lamborghini aesthetic elements - positioned to avoid text overlap */}
        <div className="absolute top-10 right-10 text-4xl opacity-5 animate-pulse pointer-events-none">
          🏎️
        </div>
        <div className="absolute bottom-10 left-10 text-3xl opacity-5 animate-bounce pointer-events-none">
          💎
        </div>
        <div className="absolute top-1/3 right-5 text-3xl opacity-5 animate-pulse pointer-events-none">
          ⚡
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left lg:col-span-7 lg:pr-8 relative">
              <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20 hover:bg-gold-500/20 relative z-10">
                🐑💨 Sheep Meet Lambos
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 tracking-tight relative z-10">
                <span className="text-gold-400 drop-shadow-lg font-bold">
                  LAMBAAAGHINI
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed relative z-10 drop-shadow-md">
                Where fluffy sheep dream of driving supercars and fart their way
                to financial freedom. This is definitely financial advice. (JK,
                but maybe? 🐑🚗💨)
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-16">
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
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg"
                >
                  <Link to="/whitepaper">Read Whitepaper</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative lg:col-span-5">
              <div className="relative crypto-glow rounded-2xl overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=800"
                  alt="Lambaaaghini - Luxury meets DeFi"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent rounded-2xl" />
              </div>

              {/* Enhanced floating elements with Lamborghini theme */}
              <div className="absolute -top-4 -right-4 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded-lg px-4 py-2 animate-pulse">
                <div className="text-gold-400 font-semibold text-sm">
                  🚀 Maybe Moon?
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 animate-pulse">
                <div className="text-purple-400 font-semibold text-sm">
                  ⚡ Solana Speed
                </div>
              </div>

              {/* Additional Lamborghini-themed floating elements */}
              <div className="absolute top-1/2 -right-6 bg-gold-500/10 backdrop-blur-sm border border-gold-500/20 rounded-full p-3 animate-bounce">
                <div className="text-gold-400 text-xl">🏎️</div>
              </div>

              <div className="absolute top-1/4 -left-6 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full p-2 animate-pulse">
                <div className="text-purple-400 text-lg">🐑</div>
              </div>
            </div>
          </div>

          {/* Centered Stats Section */}
          <div className="mt-20">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-400">
                  🚀 Moon
                </div>
                <div className="text-sm text-foreground font-medium">
                  Trajectory Status
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400">
                  🐑 Fluffy
                </div>
                <div className="text-sm text-foreground font-medium">
                  Sheep Vibes
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-400">
                  🏎️ Fast
                </div>
                <div className="text-sm text-foreground font-medium">
                  Lambo Speed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400">
                  💎 Hodl
                </div>
                <div className="text-sm text-foreground font-medium">
                  Diamond Hands
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-purple-950/20 via-background to-amber-950/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gold-400 font-bold">Memetically </span>
              <span className="text-gold-400 font-bold">Engineered</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built by sheep who somehow learned to code while dreaming of
              Lamborghinis. Features may include excessive bleating and
              questionable financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  🏎️ Lambo-Speed Transactions
                </h3>
                <p className="text-muted-foreground">
                  Our transactions are so fast, they make your cousin's Honda
                  Civic look like it's standing still. We're talking microsecond
                  execution because time is money and money is lambos.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  🛡️ Fort Knox for Sheep
                </h3>
                <p className="text-muted-foreground">
                  Our security is tighter than your pants after Thanksgiving
                  dinner. We protect your precious lamb tokens with
                  military-grade encryption and the power of friendship.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Coins className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  💰 Money Printer Go Brrr
                </h3>
                <p className="text-muted-foreground">
                  We've scientifically engineered yields so high, they might
                  actually be illegal in several countries. APY so big it needs
                  its own ZIP code.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  📊 PhD-Level Number Magic
                </h3>
                <p className="text-muted-foreground">
                  Our analytics are so advanced, they predicted you'd read this
                  sentence. Charts with more lines than a Taylor Swift song and
                  twice as emotional.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  🐑 Sheep Driving Supercars
                </h3>
                <p className="text-muted-foreground">
                  Join our exclusive club where fluffy farm animals discuss
                  horsepower and torque curves. Warning: May contain excessive
                  bleating about lambos.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Rocket className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  🌉 Bridge to Everywhere
                </h3>
                <p className="text-muted-foreground">
                  We're building bridges faster than SimCity on speed mode. Soon
                  your lambs will hop between blockchains like they're playing
                  interdimensional hopscotch.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-900/30 via-amber-950/20 to-purple-950/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Drive the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Connect your Solana wallet and join thousands of investors already
            earning premium yields.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-6 text-lg crypto-glow"
            >
              <Link to="/launchpad">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg"
            >
              View Documentation
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Supports Phantom, Solflare, and Ledger wallets
          </div>
        </div>
      </section>
    </div>
  );
}
