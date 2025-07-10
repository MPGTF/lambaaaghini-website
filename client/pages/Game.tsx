import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameState {
  carAngle: number;
  carJumping: boolean;
  obstacles: Array<{ angle: number; id: number }>;
  score: number;
  gameRunning: boolean;
  gameOver: boolean;
  fartClouds: Array<{ angle: number; id: number; opacity: number }>;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    carAngle: 0,
    carJumping: false,
    obstacles: [],
    score: 0,
    gameRunning: false,
    gameOver: false,
    fartClouds: [],
  });

  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const fartIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create fart sound effect
  const playFartSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create fart-like sound
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        50,
        audioContext.currentTime + 0.1,
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        80,
        audioContext.currentTime + 0.15,
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        30,
        audioContext.currentTime + 0.3,
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.type = "sawtooth";
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Audio not supported, but the game continues!");
    }
  }, []);

  const jump = useCallback(() => {
    if (!gameState.gameRunning || gameState.carJumping || gameState.gameOver)
      return;

    playFartSound();

    setGameState((prev) => ({
      ...prev,
      carJumping: true,
      fartClouds: [
        ...prev.fartClouds,
        { angle: prev.carAngle - 10, id: fartIdRef.current++, opacity: 1 },
      ],
    }));

    // End jump after 500ms
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, carJumping: false }));
    }, 500);
  }, [
    gameState.gameRunning,
    gameState.carJumping,
    gameState.gameOver,
    playFartSound,
  ]);

  const startGame = () => {
    setGameState({
      carAngle: 0,
      carJumping: false,
      obstacles: [],
      score: 0,
      gameRunning: true,
      gameOver: false,
      fartClouds: [],
    });
  };

  const resetGame = () => {
    setGameState({
      carAngle: 0,
      carJumping: false,
      obstacles: [],
      score: 0,
      gameRunning: false,
      gameOver: false,
      fartClouds: [],
    });
  };

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        const newCarAngle = (prev.carAngle + 2) % 360;
        let newObstacles = [...prev.obstacles];
        let newScore = prev.score;
        let newGameOver = false;

        // Move obstacles
        newObstacles = newObstacles.map((obstacle) => ({
          ...obstacle,
          angle: (obstacle.angle + 2) % 360,
        }));

        // Remove obstacles that have passed
        newObstacles = newObstacles.filter((obstacle) => {
          const angleDiff = Math.abs(obstacle.angle - newCarAngle);
          if (angleDiff < 10 || angleDiff > 350) {
            if (!prev.carJumping) {
              newGameOver = true;
            } else {
              newScore += 10;
            }
            return false;
          }
          return true;
        });

        // Add new obstacles randomly
        if (Math.random() < 0.02) {
          newObstacles.push({
            angle: (newCarAngle + 180) % 360,
            id: obstacleIdRef.current++,
          });
        }

        // Update fart clouds
        const newFartClouds = prev.fartClouds
          .map((cloud) => ({
            ...cloud,
            opacity: cloud.opacity - 0.02,
          }))
          .filter((cloud) => cloud.opacity > 0);

        // Increase score over time
        if (!newGameOver) {
          newScore += 1;
        }

        return {
          ...prev,
          carAngle: newCarAngle,
          obstacles: newObstacles,
          score: newScore,
          gameOver: newGameOver,
          gameRunning: !newGameOver,
          fartClouds: newFartClouds,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameRunning]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🏎️💨 Professional Racing Simulator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gold-400 font-bold">LAMBAAAGHINI</span>{" "}
            <span className="text-purple-400 font-bold">RACER</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the pinnacle of automotive excellence with our
            scientifically-engineered racing simulation featuring advanced
            fart-propulsion technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-center text-gold-400">
                  Professional Racing Circuit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-green-900/20 to-green-700/20 rounded-full border-4 border-gold-500/30">
                  {/* Track */}
                  <div className="absolute inset-4 border-4 border-dashed border-muted/50 rounded-full"></div>

                  {/* Car */}
                  <div
                    className="absolute w-12 h-12 transition-all duration-100"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `
                        translate(-50%, -50%) 
                        rotate(${gameState.carAngle}deg) 
                        translateY(-120px) 
                        ${gameState.carJumping ? "translateZ(10px) scale(1.2)" : ""}
                      `,
                    }}
                  >
                    <div
                      className={`text-4xl transition-all duration-300 ${gameState.carJumping ? "animate-bounce" : ""}`}
                    >
                      🐑🏎️
                    </div>
                  </div>

                  {/* Obstacles */}
                  {gameState.obstacles.map((obstacle) => (
                    <div
                      key={obstacle.id}
                      className="absolute w-8 h-8 text-2xl"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${obstacle.angle}deg) 
                          translateY(-120px)
                        `,
                      }}
                    >
                      🚧
                    </div>
                  ))}

                  {/* Fart Clouds */}
                  {gameState.fartClouds.map((cloud) => (
                    <div
                      key={cloud.id}
                      className="absolute w-6 h-6 text-xl animate-pulse"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${cloud.angle}deg) 
                          translateY(-110px)
                        `,
                        opacity: cloud.opacity,
                      }}
                    >
                      💨
                    </div>
                  ))}

                  {/* Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">🐑</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-8 text-center space-y-4">
                  {!gameState.gameRunning && !gameState.gameOver && (
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4 text-lg"
                    >
                      Start Professional Racing
                    </Button>
                  )}

                  {gameState.gameRunning && (
                    <Button
                      onClick={jump}
                      onTouchStart={jump}
                      className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold px-12 py-6 text-xl crypto-glow"
                    >
                      💨 FART JUMP 💨
                    </Button>
                  )}

                  {gameState.gameOver && (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-red-400">
                        CRASH! Your lamb got rekt! 🐑💥
                      </div>
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4"
                      >
                        Try Again (Maybe Don't)
                      </Button>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Press SPACEBAR or tap the button to activate fart-propulsion
                    jump technology
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            <Card className="glass-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">
                      {gameState.score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Professional Points
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {gameState.obstacles.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Obstacles
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-400">
                  Game Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>🏎️ Your lamb-car drives automatically in a circle</p>
                <p>🚧 Avoid obstacles by jumping over them</p>
                <p>💨 Jumping produces fart-powered propulsion</p>
                <p>🔊 Advanced sound effects included</p>
                <p>📱 Works on mobile and desktop</p>
                <p className="text-gold-400 font-semibold">
                  This is definitely a serious racing simulator and not a joke.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Technical Specs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p>🔧 Engine: Fart-Powered V8</p>
                <p>⚡ Acceleration: 0-60 in 3.2 bleats</p>
                <p>🏁 Top Speed: Mach 0.0001</p>
                <p>💨 Emission Type: 100% Organic</p>
                <p>🛡️ Safety Rating: Questionable</p>
                <p>🎮 Physics: Scientifically Accurate*</p>
                <p className="text-xs text-muted-foreground">
                  *Not actually scientifically accurate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
