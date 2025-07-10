import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GalagaGame from "@/components/games/GalagaGame";
import BarrioGame from "@/components/games/BarrioGame";

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<"galaga" | "barrio">(
    "galaga",
  );

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🎮 Professional Gaming Arcade
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gold-400 font-bold">LAMBAAAGHINI</span>{" "}
            <span className="text-purple-400 font-bold">GAMES</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our premium collection of professional gaming experiences
            featuring advanced mechanics and seriously silly gameplay.
          </p>
        </div>

        {/* Game Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setSelectedGame("galaga")}
            className={`px-8 py-4 text-lg font-semibold transition-all ${
              selectedGame === "galaga"
                ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                : "bg-gray-600 hover:bg-gray-500 text-gray-200"
            }`}
          >
            🐑 Lamb Defense Force
          </Button>
          <Button
            onClick={() => setSelectedGame("barrio")}
            className={`px-8 py-4 text-lg font-semibold transition-all ${
              selectedGame === "barrio"
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                : "bg-gray-600 hover:bg-gray-500 text-gray-200"
            }`}
          >
            🌿 Barrio's Garden Adventure
          </Button>
        </div>

        {/* Game Area */}
        <Card className="glass-card border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-center text-gold-400">
              {selectedGame === "galaga"
                ? "Professional Defense Perimeter"
                : "Barrio's Magical Garden World"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {selectedGame === "galaga" ? <GalagaGame /> : <BarrioGame />}
            </div>
          </CardContent>
        </Card>

        {/* Game Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="glass-card border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400">
                🐑 Lamb Defense Force
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Galaga-style space shooter with fart-powered weapons</p>
              <p>
                • Defend against zombie invasion using professional lamb tactics
              </p>
              <p>• Earn gas tokens and upgrade to silly status titles</p>
              <p>• Multiple zombie types and power-ups</p>
              <p>• Wallet-connected leaderboards and progression</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">
                🌿 Barrio's Garden Adventure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Mario-style platformer featuring Mexican gardener Barrio</p>
              <p>• Collect magical garden coins and avoid plant enemies</p>
              <p>• Jump through mystical garden platforms and obstacles</p>
              <p>• Professional landscaping mechanics and physics</p>
              <p>• Authentic gardening experience with arcade action</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
