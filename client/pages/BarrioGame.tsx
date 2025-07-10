import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BarrioGameState {
  playerX: number;
  playerY: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  coins: Array<{ x: number; y: number; id: number }>;
  enemies: Array<{ x: number; y: number; id: number; direction: number }>;
  score: number;
  lives: number;
  gameRunning: boolean;
  gameOver: boolean;
  level: number;
  platforms: Array<{ x: number; y: number; width: number; height: number }>;
}

export default function BarrioGame() {
  const { connected, publicKey } = useWallet();

  const [gameState, setGameState] = useState<BarrioGameState>({
    playerX: 100,
    playerY: 400,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    coins: [
      { x: 250, y: 350, id: 1 },
      { x: 500, y: 250, id: 2 },
      { x: 700, y: 150, id: 3 },
      { x: 350, y: 450, id: 4 },
      { x: 600, y: 350, id: 5 },
    ],
    enemies: [
      { x: 300, y: 380, id: 1, direction: 1 },
      { x: 550, y: 280, id: 2, direction: -1 },
    ],
    score: 0,
    lives: 3,
    gameRunning: false,
    gameOver: false,
    level: 1,
    platforms: [
      { x: 0, y: 500, width: 800, height: 100 }, // Ground
      { x: 200, y: 400, width: 150, height: 20 },
      { x: 450, y: 300, width: 150, height: 20 },
      { x: 650, y: 200, width: 150, height: 20 },
      { x: 100, y: 350, width: 100, height: 20 },
      { x: 350, y: 250, width: 120, height: 20 },
    ],
  });

  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const coinIdRef = useRef(6);
  const enemyIdRef = useRef(3);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_SIZE = 30;
  const GRAVITY = 0.8;
  const JUMP_POWER = -15;
  const MOVE_SPEED = 5;

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      playerX: 100,
      playerY: 400,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      score: 0,
      lives: 3,
      gameRunning: true,
      gameOver: false,
    }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      playerX: 100,
      playerY: 400,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      score: 0,
      lives: 3,
      gameRunning: false,
      gameOver: false,
    }));
  };

  const jump = useCallback(() => {
    setGameState((prev) => {
      if (!prev.gameRunning || !prev.isGrounded || prev.gameOver) return prev;
      return {
        ...prev,
        velocityY: JUMP_POWER,
        isGrounded: false,
      };
    });
  }, []);

  // Check collision with platforms
  const checkPlatformCollision = (x: number, y: number, platforms: any[]) => {
    for (const platform of platforms) {
      if (
        x + PLAYER_SIZE > platform.x &&
        x < platform.x + platform.width &&
        y + PLAYER_SIZE > platform.y &&
        y < platform.y + platform.height
      ) {
        return platform;
      }
    }
    return null;
  };

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        let newPlayerX = prev.playerX;
        let newPlayerY = prev.playerY;
        let newVelocityX = prev.velocityX;
        let newVelocityY = prev.velocityY;
        let newIsGrounded = prev.isGrounded;
        let newCoins = [...prev.coins];
        let newEnemies = [...prev.enemies];
        let newScore = prev.score;
        let newLives = prev.lives;
        let newGameOver = false;

        // Handle input
        if (keysPressed.current.has("ArrowLeft")) {
          newVelocityX = -MOVE_SPEED;
        } else if (keysPressed.current.has("ArrowRight")) {
          newVelocityX = MOVE_SPEED;
        } else {
          newVelocityX *= 0.8; // Friction
        }

        // Apply gravity
        newVelocityY += GRAVITY;

        // Update position
        newPlayerX += newVelocityX;
        newPlayerY += newVelocityY;

        // Boundary checks
        if (newPlayerX < 0) newPlayerX = 0;
        if (newPlayerX > GAME_WIDTH - PLAYER_SIZE)
          newPlayerX = GAME_WIDTH - PLAYER_SIZE;

        // Platform collision detection
        newIsGrounded = false;
        const collision = checkPlatformCollision(
          newPlayerX,
          newPlayerY,
          prev.platforms,
        );

        if (collision && newVelocityY >= 0) {
          // Landing on platform
          newPlayerY = collision.y - PLAYER_SIZE;
          newVelocityY = 0;
          newIsGrounded = true;
        }

        // Fall off screen
        if (newPlayerY > GAME_HEIGHT) {
          newLives--;
          if (newLives <= 0) {
            newGameOver = true;
          } else {
            // Respawn
            newPlayerX = 100;
            newPlayerY = 400;
            newVelocityX = 0;
            newVelocityY = 0;
            newIsGrounded = false;
          }
        }

        // Coin collection
        newCoins = newCoins.filter((coin) => {
          const distance = Math.sqrt(
            Math.pow(coin.x - (newPlayerX + PLAYER_SIZE / 2), 2) +
              Math.pow(coin.y - (newPlayerY + PLAYER_SIZE / 2), 2),
          );
          if (distance < 25) {
            newScore += 100;
            return false;
          }
          return true;
        });

        // Enemy movement and collision
        newEnemies = newEnemies.map((enemy) => {
          let newEnemyX = enemy.x + enemy.direction * 2;

          // Reverse direction at platform edges
          const enemyPlatform = checkPlatformCollision(
            newEnemyX,
            enemy.y,
            prev.platforms,
          );
          if (!enemyPlatform || newEnemyX < 0 || newEnemyX > GAME_WIDTH - 30) {
            return { ...enemy, direction: enemy.direction * -1 };
          }

          // Check collision with player
          const playerDistance = Math.sqrt(
            Math.pow(newEnemyX - newPlayerX, 2) +
              Math.pow(enemy.y - newPlayerY, 2),
          );

          if (playerDistance < 35) {
            newLives--;
            if (newLives <= 0) {
              newGameOver = true;
            } else {
              // Respawn
              newPlayerX = 100;
              newPlayerY = 400;
              newVelocityX = 0;
              newVelocityY = 0;
              newIsGrounded = false;
            }
          }

          return { ...enemy, x: newEnemyX };
        });

        // Win condition - collect all coins
        if (newCoins.length === 0 && !newGameOver) {
          newScore += 1000; // Level completion bonus
          // Could add next level logic here
        }

        return {
          ...prev,
          playerX: newPlayerX,
          playerY: newPlayerY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          isGrounded: newIsGrounded,
          coins: newCoins,
          enemies: newEnemies,
          score: newScore,
          lives: newLives,
          gameOver: newGameOver,
          gameRunning: !newGameOver,
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "Space"
      ) {
        event.preventDefault();
        keysPressed.current.add(event.code);

        if (event.code === "Space") {
          jump();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "Space"
      ) {
        event.preventDefault();
        keysPressed.current.delete(event.code);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [jump]);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-green-500/10 text-green-400 border-green-500/20">
            🌿 Professional Landscaping Simulator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-green-400 font-bold">BARRIO'S</span>{" "}
            <span className="text-gold-400 font-bold">GARDEN ADVENTURE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the authentic life of a Mexican gardener navigating
            mystical garden platforms to collect magical coins and avoid
            dangerous plant creatures in this professional landscaping
            simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-center text-green-400">
                  Barrio's Magical Garden World
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="relative mx-auto bg-gradient-to-b from-sky-400/20 via-green-400/10 to-amber-700/20 border-4 border-green-500/30 overflow-hidden"
                  style={{
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                    imageRendering: "pixelated",
                  }}
                >
                  {/* Background elements */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-lg opacity-20"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                        }}
                      >
                        {
                          ["🌸", "🌿", "🦋", "🌱"][
                            Math.floor(Math.random() * 4)
                          ]
                        }
                      </div>
                    ))}
                  </div>

                  {/* Platforms */}
                  {gameState.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="absolute bg-gradient-to-r from-amber-600 to-amber-800 border-2 border-amber-500"
                      style={{
                        left: platform.x,
                        top: platform.y,
                        width: platform.width,
                        height: platform.height,
                        imageRendering: "pixelated",
                      }}
                    >
                      {index === 0 && (
                        <div className="w-full h-full bg-gradient-to-t from-green-600 to-green-400 flex items-center justify-center text-xs text-white font-bold opacity-50">
                          TIERRA
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Player (Barrio) */}
                  <div
                    className="absolute transition-all duration-100 flex items-center justify-center text-2xl"
                    style={{
                      left: gameState.playerX,
                      top: gameState.playerY,
                      width: PLAYER_SIZE,
                      height: PLAYER_SIZE,
                      imageRendering: "pixelated",
                      zIndex: 10,
                    }}
                  >
                    👨‍🌾
                  </div>

                  {/* Coins */}
                  {gameState.coins.map((coin) => (
                    <div
                      key={coin.id}
                      className="absolute text-xl animate-spin pointer-events-none"
                      style={{
                        left: coin.x,
                        top: coin.y,
                        imageRendering: "pixelated",
                      }}
                    >
                      🪙
                    </div>
                  ))}

                  {/* Enemies */}
                  {gameState.enemies.map((enemy) => (
                    <div
                      key={enemy.id}
                      className="absolute text-xl animate-pulse pointer-events-none"
                      style={{
                        left: enemy.x,
                        top: enemy.y,
                        imageRendering: "pixelated",
                        transform:
                          enemy.direction === 1 ? "scaleX(1)" : "scaleX(-1)",
                      }}
                    >
                      🌵
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-8 text-center space-y-4">
                  {!gameState.gameRunning && !gameState.gameOver && (
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-semibold px-8 py-4 text-lg"
                    >
                      Begin Garden Adventure
                    </Button>
                  )}

                  {gameState.gameOver && (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-red-400">
                        ¡Ay, Dios mío! Garden adventure ended! Score:{" "}
                        {gameState.score} 🌿
                      </div>
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-semibold px-8 py-4"
                      >
                        Return to Garden
                      </Button>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Use ARROW KEYS to move, SPACEBAR to jump</p>
                    <p>🪙 Collect garden coins for points</p>
                    <p>🌵 Avoid dangerous cactus enemies</p>
                    <p>🌿 Professional gardening mechanics included</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            <Card className="glass-card border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-amber-400">Garden Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">
                      {gameState.score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Garden Points
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      {gameState.lives}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lives Remaining
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-400">
                      {gameState.coins.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Coins Left
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">
                  Barrio's Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>👨‍🌾 Professional Mexican gardener</p>
                <p>🌿 Expert in mystical plant navigation</p>
                <p>🪙 Collector of magical garden coins</p>
                <p>🌵 Experienced in cactus avoidance</p>
                <p>🦋 Friend to all garden creatures</p>
                <p className="text-green-400 font-semibold">
                  "¡Vamos a cultivar el jardín!"
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-amber-400">
                  Professional Gardening Specs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p>🥾 Boots: Steel-toed garden boots</p>
                <p>🧢 Hat: Authentic sombrero protection</p>
                <p>💪 Jump Height: Professional landscaper level</p>
                <p>🌱 Garden Knowledge: Extensive flora expertise</p>
                <p>⚡ Speed: Efficient plant care velocity</p>
                <p>🎮 Controls: Traditional platformer mechanics</p>
                <p className="text-xs text-muted-foreground">
                  *No actual gardening experience required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
