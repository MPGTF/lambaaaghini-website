import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import WalletConnection from "@/components/WalletConnection"; // ← DISABLED - Likely causing crash

export default function Index() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ backgroundColor: "#0a0a0b", color: "#fafafa" }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        {/* Meme-serious gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-background to-amber-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,20,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]" />

        {/* Floating elements */}
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
                🏎️ The Future of Luxury DeFi
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 tracking-tight relative z-10">
                <span className="text-gold-400 drop-shadow-lg font-bold">
                  LAMBAAAGHINI
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed relative z-10 drop-shadow-md">
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
                    <span className="ml-2">→</span>
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
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                🚀 Moon
              </div>
              <div className="text-sm text-foreground font-medium">
                Trajectory Status
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                🐑 25K+
              </div>
              <div className="text-sm text-foreground font-medium">
                Lambs in the Herd
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                🏎️ Fast
              </div>
              <div className="text-sm text-foreground font-medium">
                Lambo Speed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                💎 Hodl
              </div>
              <div className="text-sm text-foreground font-medium">
                Diamond Hands
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gold-400">Professional</span>{" "}
              <span className="text-purple-400">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Industry-leading agricultural simulation technology with
              enterprise-grade sheep management capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏎️</div>
                <h3 className="text-xl font-semibold text-gold-400 mb-3">
                  Lambo-Speed Transactions
                </h3>
                <p className="text-muted-foreground">
                  Execute trades faster than your cousin's Honda Civic with our
                  revolutionary Solana integration that definitely isn't slow.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-purple-400 mb-3">
                  Fort Knox for Sheep
                </h3>
                <p className="text-muted-foreground">
                  Military-grade security protocols that are tighter than your
                  pants after Thanksgiving dinner. Your lambs are safe with us.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gold-400 mb-3">
                  Money Printer Go Brrr
                </h3>
                <p className="text-muted-foreground">
                  Generate yields so high they might be illegal in several
                  countries. Our ROI calculator needs scientific notation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
