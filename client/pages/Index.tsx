import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnection from "@/components/WalletConnection";
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-gold-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        {/* Floating Lamborghini aesthetic elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">
          🏎️
        </div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-bounce">
          💎
        </div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-15 animate-pulse">
          🐑
        </div>
        <div className="absolute top-60 left-1/4 text-3xl opacity-10 animate-bounce">
          ⚡
        </div>
        <div className="absolute bottom-20 right-1/3 text-4xl opacity-15 animate-pulse">
          🚀
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left lg:col-span-7 lg:pr-8">
              <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20 hover:bg-gold-500/20">
                🏎️ The Future of Luxury DeFi
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 tracking-tight relative z-10">
                <span className="gradient-text">LAMBAAAGHINI</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
                Experience the pinnacle of luxury in the Solana ecosystem.
                High-performance DeFi protocols engineered for speed, style, and
                unprecedented returns.
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
                  🚀 1000x Potential
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
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  $50M+
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Value Locked
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  25K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  0.001s
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg. Transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Engineered for <span className="gradient-text">Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on Solana's high-performance blockchain, Lambaaaghini
              delivers institutional-grade DeFi protocols with luxury-class user
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">🏎️ Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Execute trades in milliseconds with Solana's 65,000 TPS
                  capability. Faster than a Huracán on the Autobahn.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Bank-Grade Security</h3>
                <p className="text-muted-foreground">
                  Multi-signature wallets, audited smart contracts, and
                  insurance coverage protect your assets with institutional
                  security.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Coins className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Yields</h3>
                <p className="text-muted-foreground">
                  Access exclusive high-yield farming opportunities and
                  liquidity pools reserved for Lambaaaghini token holders.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Professional-grade trading tools and real-time analytics give
                  you the edge in volatile markets.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Exclusive Community</h3>
                <p className="text-muted-foreground">
                  Join an elite community of DeFi investors with exclusive
                  access to alpha, airdrops, and premium features.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:crypto-glow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Rocket className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Cross-Chain Future</h3>
                <p className="text-muted-foreground">
                  Built for interoperability with planned expansion to Ethereum,
                  Polygon, and other major chains.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-900/10 via-background to-gold-900/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Drive the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Connect your Solana wallet and join thousands of investors already
            earning premium yields.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <WalletConnection
              variant="default"
              className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-6 text-lg crypto-glow"
            />
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
