import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-background to-amber-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,20,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6">
        {/* Lamb car image */}
        <div className="mb-12 relative">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=800"
            alt="Lambaaaghini - Luxury meets DeFi"
            className="w-full max-w-2xl h-auto object-cover rounded-2xl crypto-glow shadow-2xl"
          />
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-purple-500/20 rounded-2xl blur-xl scale-110 -z-10" />
        </div>

        {/* Enter button */}
        <Button
          onClick={onEnter}
          size="lg"
          className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-bold px-12 py-6 text-xl crypto-glow transform hover:scale-105 transition-all duration-200"
        >
          ENTER NOW
        </Button>

        {/* Subtle branding */}
        <div className="mt-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gold-400 opacity-80">
            LAMBAAAGHINI
          </h1>
          <p className="text-muted-foreground text-sm mt-2 opacity-60">
            Where sheep meet supercars
          </p>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-10 animate-pulse pointer-events-none">
        🐑
      </div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-10 animate-bounce pointer-events-none">
        🏎️
      </div>
      <div
        className="absolute top-1/2 right-20 text-3xl opacity-10 animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      >
        💎
      </div>
      <div
        className="absolute bottom-1/3 left-20 text-3xl opacity-10 animate-bounce pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        ⚡
      </div>
    </div>
  );
}
