import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnection from "@/components/WalletConnection";

interface GameState {
  playerX: number;
  farts: Array<{
    x: number;
    y: number;
    id: number;
    velocity: number;
  }>;
  zombies: Array<{
    x: number;
    y: number;
    id: number;
    velocity: number;
    health: number;
    type: "normal" | "fast" | "tank";
  }>;
  powerUps: Array<{
    x: number;
    y: number;
    id: number;
    type: "speed" | "multishot" | "bigfart";
  }>;
  score: number;
  gameRunning: boolean;
  gameOver: boolean;
  lives: number;
  wave: number;
  playerPowerUp: string | null;
  powerUpTime: number;
  explosions: Array<{ x: number; y: number; id: number; opacity: number }>;
  fartBombCooldown: number;
  fartBombs: Array<{
    x: number;
    y: number;
    id: number;
    radius: number;
    maxRadius: number;
    expanding: boolean;
  }>;
}

interface HighScore {
  walletAddress: string;
  score: number;
  wave: number;
  timestamp: number;
}

export default function Game() {
  const { connected, publicKey } = useWallet();
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [personalBest, setPersonalBest] = useState<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    playerX: 400,
    farts: [],
    zombies: [],
    powerUps: [],
    score: 0,
    gameRunning: false,
    gameOver: false,
    lives: 3,
    wave: 1,
    playerPowerUp: null,
    powerUpTime: 0,
    explosions: [],
    fartBombCooldown: 0,
    fartBombs: [],
  });

  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const lastShotTime = useRef<number>(0);
  const fartIdRef = useRef(0);
  const zombieIdRef = useRef(0);
  const powerUpIdRef = useRef(0);
  const explosionIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isFiringRef = useRef(false);
  const [isFiring, setIsFiring] = useState(false);
  const fartBombIdRef = useRef(0);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_Y = 550;
  const PLAYER_SIZE = 40;
  const PLAYER_SPEED = 5;
  const FART_SPEED = 8;
  const ZOMBIE_SIZE = 30;

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("lambaaaghini-galaga-scores");
    if (savedScores) {
      const scores: HighScore[] = JSON.parse(savedScores);
      setHighScores(scores.sort((a, b) => b.score - a.score).slice(0, 10));

      if (connected && publicKey) {
        const userBest = scores
          .filter((score) => score.walletAddress === publicKey.toBase58())
          .sort((a, b) => b.score - a.score)[0];
        setPersonalBest(userBest?.score || 0);
      }
    }
  }, [connected, publicKey]);

  // Save high score
  const saveHighScore = useCallback(
    (score: number, wave: number) => {
      if (!connected || !publicKey) return;

      const newScore: HighScore = {
        walletAddress: publicKey.toBase58(),
        score,
        wave,
        timestamp: Date.now(),
      };

      const savedScores = localStorage.getItem("lambaaaghini-galaga-scores");
      const scores: HighScore[] = savedScores ? JSON.parse(savedScores) : [];
      scores.push(newScore);

      const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 50);
      localStorage.setItem(
        "lambaaaghini-galaga-scores",
        JSON.stringify(topScores),
      );

      setHighScores(topScores.slice(0, 10));

      const userBest = topScores
        .filter((s) => s.walletAddress === publicKey.toBase58())
        .sort((a, b) => b.score - a.score)[0];
      setPersonalBest(userBest?.score || 0);
    },
    [connected, publicKey],
  );

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

      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        80,
        audioContext.currentTime + 0.1,
      );

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );

      oscillator.type = "sawtooth";
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("Audio not supported, but the game continues!");
    }
  }, []);

  // Create explosion sound effect
  const playExplosionSound = useCallback(() => {
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

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        50,
        audioContext.currentTime + 0.3,
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.type = "square";
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Audio not supported, but the game continues!");
    }
  }, []);

  // Create fart bomb sound effect
  const playFartBombSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Create deep bass fart bomb sound
      for (let i = 0; i < 5; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          80 - i * 10,
          audioContext.currentTime,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          20,
          audioContext.currentTime + 1,
        );

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1,
        );

        oscillator.type = "sawtooth";
        oscillator.start(audioContext.currentTime + i * 0.1);
        oscillator.stop(audioContext.currentTime + 1 + i * 0.1);
      }
    } catch (error) {
      console.log("Audio not supported, but the game continues!");
    }
  }, []);

  const shootFart = useCallback(() => {
    const now = Date.now();
    const shotDelay = gameState.playerPowerUp === "multishot" ? 100 : 200;

    if (now - lastShotTime.current < shotDelay) return;

    lastShotTime.current = now;
    playFartSound();

    setGameState((prev) => {
      const newFarts = [...prev.farts];

      if (prev.playerPowerUp === "multishot") {
        // Triple shot
        newFarts.push(
          {
            x: prev.playerX - 10,
            y: PLAYER_Y,
            id: fartIdRef.current++,
            velocity: FART_SPEED,
          },
          {
            x: prev.playerX,
            y: PLAYER_Y,
            id: fartIdRef.current++,
            velocity: FART_SPEED,
          },
          {
            x: prev.playerX + 10,
            y: PLAYER_Y,
            id: fartIdRef.current++,
            velocity: FART_SPEED,
          },
        );
      } else {
        newFarts.push({
          x: prev.playerX,
          y: PLAYER_Y,
          id: fartIdRef.current++,
          velocity: FART_SPEED,
        });
      }

      return { ...prev, farts: newFarts };
    });
  }, [playFartSound, gameState.playerPowerUp]);

  const launchFartBomb = useCallback(() => {
    setGameState((prev) => {
      if (prev.fartBombCooldown > 0) return prev;

      playFartBombSound();

      return {
        ...prev,
        fartBombCooldown: 45000, // 45 seconds
        fartBombs: [
          ...prev.fartBombs,
          {
            x: prev.playerX,
            y: PLAYER_Y - 50,
            id: fartBombIdRef.current++,
            radius: 0,
            maxRadius: 150,
            expanding: true,
          },
        ],
      };
    });
  }, [playFartBombSound]);

  const startGame = () => {
    setGameState({
      playerX: GAME_WIDTH / 2,
      farts: [],
      zombies: [],
      powerUps: [],
      score: 0,
      gameRunning: true,
      gameOver: false,
      lives: 3,
      wave: 1,
      playerPowerUp: null,
      powerUpTime: 0,
      explosions: [],
      fartBombCooldown: 0,
      fartBombs: [],
    });
  };

  const resetGame = () => {
    setGameState({
      playerX: GAME_WIDTH / 2,
      farts: [],
      zombies: [],
      powerUps: [],
      score: 0,
      gameRunning: false,
      gameOver: false,
      lives: 3,
      wave: 1,
      playerPowerUp: null,
      powerUpTime: 0,
      explosions: [],
      fartBombCooldown: 0,
      fartBombs: [],
    });
  };

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        let newPlayerX = prev.playerX;
        let newFarts = [...prev.farts];
        let newZombies = [...prev.zombies];
        let newPowerUps = [...prev.powerUps];
        let newScore = prev.score;
        let newLives = prev.lives;
        let newWave = prev.wave;
        let newGameOver = false;
        let newPowerUpTime = Math.max(0, prev.powerUpTime - 16);
        let newPlayerPowerUp = newPowerUpTime > 0 ? prev.playerPowerUp : null;
        let newExplosions = [...prev.explosions];
        let newFartBombCooldown = Math.max(0, prev.fartBombCooldown - 16);
        let newFartBombs = [...prev.fartBombs];

        // Player movement
        const speed =
          prev.playerPowerUp === "speed" ? PLAYER_SPEED * 1.5 : PLAYER_SPEED;
        if (
          keysPressed.current.has("ArrowLeft") &&
          newPlayerX > PLAYER_SIZE / 2
        ) {
          newPlayerX -= speed;
        }
        if (
          keysPressed.current.has("ArrowRight") &&
          newPlayerX < GAME_WIDTH - PLAYER_SIZE / 2
        ) {
          newPlayerX += speed;
        }

        // Auto-shoot when fire button is pressed
        if (isFiringRef.current) {
          shootFart();
        }

        // Move farts up
        newFarts = newFarts
          .map((fart) => ({ ...fart, y: fart.y - fart.velocity }))
          .filter((fart) => fart.y > -10);

        // Move zombies down
        newZombies = newZombies.map((zombie) => ({
          ...zombie,
          y: zombie.y + zombie.velocity,
        }));

        // Move power-ups down
        newPowerUps = newPowerUps
          .map((powerUp) => ({ ...powerUp, y: powerUp.y + 2 }))
          .filter((powerUp) => powerUp.y < GAME_HEIGHT + 20);

        // Check fart-zombie collisions
        newFarts = newFarts.filter((fart) => {
          let hit = false;
          newZombies = newZombies.filter((zombie) => {
            const distance = Math.sqrt(
              Math.pow(fart.x - zombie.x, 2) + Math.pow(fart.y - zombie.y, 2),
            );
            if (distance < 25 && !hit) {
              hit = true;
              zombie.health--;

              if (zombie.health <= 0) {
                // Zombie destroyed
                newScore +=
                  zombie.type === "tank"
                    ? 50
                    : zombie.type === "fast"
                      ? 30
                      : 20;
                playExplosionSound();

                // Add explosion effect
                newExplosions.push({
                  x: zombie.x,
                  y: zombie.y,
                  id: explosionIdRef.current++,
                  opacity: 1,
                });

                // Random power-up drop
                if (Math.random() < 0.1) {
                  const powerUpTypes = ["speed", "multishot", "bigfart"];
                  newPowerUps.push({
                    x: zombie.x,
                    y: zombie.y,
                    id: powerUpIdRef.current++,
                    type: powerUpTypes[
                      Math.floor(Math.random() * powerUpTypes.length)
                    ] as "speed" | "multishot" | "bigfart",
                  });
                }

                return false;
              }
              return true;
            }
            return true;
          });
          return !hit;
        });

        // Check zombie-player collision or zombies reaching bottom
        newZombies = newZombies.filter((zombie) => {
          // Check if zombie reached player
          const playerDistance = Math.sqrt(
            Math.pow(zombie.x - newPlayerX, 2) +
              Math.pow(zombie.y - PLAYER_Y, 2),
          );

          if (playerDistance < 30 || zombie.y > GAME_HEIGHT) {
            newLives--;
            playExplosionSound();

            // Add explosion at player position
            newExplosions.push({
              x: newPlayerX,
              y: PLAYER_Y,
              id: explosionIdRef.current++,
              opacity: 1,
            });

            return false;
          }
          return true;
        });

        // Check power-up collection
        newPowerUps = newPowerUps.filter((powerUp) => {
          const distance = Math.sqrt(
            Math.pow(powerUp.x - newPlayerX, 2) +
              Math.pow(powerUp.y - PLAYER_Y, 2),
          );
          if (distance < 30) {
            newPlayerPowerUp = powerUp.type;
            newPowerUpTime = 5000; // 5 seconds
            return false;
          }
          return true;
        });

        // Game over check
        if (newLives <= 0) {
          newGameOver = true;
          if (connected && newScore > 0) {
            saveHighScore(newScore, newWave);
          }
        }

        // Spawn new zombies
        if (
          newZombies.length < 3 + newWave &&
          Math.random() < 0.02 + newWave * 0.005
        ) {
          const zombieTypes = ["normal", "fast", "tank"] as const;
          const type =
            zombieTypes[Math.floor(Math.random() * zombieTypes.length)];

          let health = 1;
          let velocity = 1;

          if (type === "fast") {
            velocity = 2;
          } else if (type === "tank") {
            health = 3;
            velocity = 0.5;
          }

          newZombies.push({
            x: Math.random() * (GAME_WIDTH - ZOMBIE_SIZE) + ZOMBIE_SIZE / 2,
            y: -ZOMBIE_SIZE,
            id: zombieIdRef.current++,
            velocity,
            health,
            type,
          });
        }

        // Wave progression
        if (newZombies.length === 0 && newScore > newWave * 500) {
          newWave++;
        }

        // Update explosions
        newExplosions = newExplosions
          .map((explosion) => ({
            ...explosion,
            opacity: explosion.opacity - 0.05,
          }))
          .filter((explosion) => explosion.opacity > 0);

        return {
          ...prev,
          playerX: newPlayerX,
          farts: newFarts,
          zombies: newZombies,
          powerUps: newPowerUps,
          score: newScore,
          lives: newLives,
          wave: newWave,
          gameOver: newGameOver,
          gameRunning: !newGameOver,
          playerPowerUp: newPlayerPowerUp,
          powerUpTime: newPowerUpTime,
          explosions: newExplosions,
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
  }, [
    gameState.gameRunning,
    saveHighScore,
    connected,
    playExplosionSound,
    shootFart,
  ]);

  // Handle keyboard input (arrow keys only)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        keysPressed.current.add(event.code);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        keysPressed.current.delete(event.code);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🐑💨 Professional Galactic Defense Simulator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gold-400 font-bold">LAMBAAAGHINI</span>{" "}
            <span className="text-purple-400 font-bold">DEFENSE FORCE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Defend the Solana ecosystem against the incoming zombie apocalypse
            using our cutting-edge fart-propulsion weapon systems and advanced
            tactical positioning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-center text-gold-400">
                  Professional Defense Perimeter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="relative mx-auto bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-green-900/20 border-4 border-gold-500/30 overflow-hidden"
                  style={{
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                    imageRendering: "pixelated",
                  }}
                >
                  {/* Stars background */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Player (Lamb) */}
                  <div
                    className="absolute transition-all duration-100 flex items-center justify-center text-3xl"
                    style={{
                      left: gameState.playerX - PLAYER_SIZE / 2,
                      top: PLAYER_Y - PLAYER_SIZE / 2,
                      width: PLAYER_SIZE,
                      height: PLAYER_SIZE,
                      imageRendering: "pixelated",
                      filter: gameState.playerPowerUp
                        ? "drop-shadow(0 0 10px gold)"
                        : "none",
                    }}
                  >
                    🐑
                  </div>

                  {/* Power-up indicator */}
                  {gameState.playerPowerUp && (
                    <div
                      className="absolute text-xs font-bold text-gold-400 animate-bounce"
                      style={{
                        left: gameState.playerX + 20,
                        top: PLAYER_Y - 30,
                      }}
                    >
                      {gameState.playerPowerUp === "speed" && "⚡SPEED"}
                      {gameState.playerPowerUp === "multishot" && "🔫MULTI"}
                      {gameState.playerPowerUp === "bigfart" && "💨BIG"}
                    </div>
                  )}

                  {/* Farts */}
                  {gameState.farts.map((fart) => (
                    <div
                      key={fart.id}
                      className="absolute text-xl animate-pulse pointer-events-none"
                      style={{
                        left: fart.x - 10,
                        top: fart.y - 10,
                        imageRendering: "pixelated",
                      }}
                    >
                      💨
                    </div>
                  ))}

                  {/* Zombies */}
                  {gameState.zombies.map((zombie) => (
                    <div
                      key={zombie.id}
                      className="absolute flex items-center justify-center animate-pulse"
                      style={{
                        left: zombie.x - ZOMBIE_SIZE / 2,
                        top: zombie.y - ZOMBIE_SIZE / 2,
                        width: ZOMBIE_SIZE,
                        height: ZOMBIE_SIZE,
                        imageRendering: "pixelated",
                        filter:
                          zombie.type === "tank"
                            ? "drop-shadow(0 0 5px red)"
                            : zombie.type === "fast"
                              ? "drop-shadow(0 0 5px yellow)"
                              : "none",
                      }}
                    >
                      <div className="text-2xl">
                        {zombie.type === "tank"
                          ? "🧟‍♂️"
                          : zombie.type === "fast"
                            ? "🧟‍♀️"
                            : "🧟"}
                      </div>
                    </div>
                  ))}

                  {/* Power-ups */}
                  {gameState.powerUps.map((powerUp) => (
                    <div
                      key={powerUp.id}
                      className="absolute text-xl animate-bounce pointer-events-none"
                      style={{
                        left: powerUp.x - 15,
                        top: powerUp.y - 15,
                        imageRendering: "pixelated",
                      }}
                    >
                      {powerUp.type === "speed" && "⚡"}
                      {powerUp.type === "multishot" && "🔫"}
                      {powerUp.type === "bigfart" && "💥"}
                    </div>
                  ))}

                  {/* Explosions */}
                  {gameState.explosions.map((explosion) => (
                    <div
                      key={explosion.id}
                      className="absolute text-3xl animate-ping pointer-events-none"
                      style={{
                        left: explosion.x - 15,
                        top: explosion.y - 15,
                        opacity: explosion.opacity,
                        imageRendering: "pixelated",
                      }}
                    >
                      💥
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-8 text-center space-y-4">
                  {!gameState.gameRunning && !gameState.gameOver && (
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4 text-lg"
                    >
                      Begin Defense Protocol
                    </Button>
                  )}

                  {gameState.gameRunning && (
                    <div className="flex justify-center gap-4 mb-4">
                      <Button
                        onMouseDown={() => {
                          setIsFiring(true);
                          isFiringRef.current = true;
                        }}
                        onMouseUp={() => {
                          setIsFiring(false);
                          isFiringRef.current = false;
                        }}
                        onMouseLeave={() => {
                          setIsFiring(false);
                          isFiringRef.current = false;
                        }}
                        onTouchStart={() => {
                          setIsFiring(true);
                          isFiringRef.current = true;
                        }}
                        onTouchEnd={() => {
                          setIsFiring(false);
                          isFiringRef.current = false;
                        }}
                        className={`bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold px-12 py-6 text-xl crypto-glow select-none ${
                          isFiring ? "scale-95 brightness-125" : ""
                        }`}
                      >
                        💨 FIRE FARTS 💨
                      </Button>
                    </div>
                  )}

                  {gameState.gameOver && (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-red-400">
                        Defense Perimeter Breached! Wave {gameState.wave}{" "}
                        reached! 🐑💥
                      </div>
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4"
                      >
                        Rebuild Defense Force
                      </Button>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Use ARROW KEYS to move, hold FIRE BUTTON to auto-fire fart
                      projectiles
                    </p>
                    <p>
                      🧟 Normal Zombies | 🧟‍♀️ Fast Zombies | 🧟‍♂️ Tank Zombies (3
                      hits)
                    </p>
                    <p>
                      ⚡ Speed Boost | 🔫 Triple Shot | 💥 Big Fart Power-ups
                    </p>
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
                  Combat Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400">
                      {gameState.score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Eliminations
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
                    <div className="text-lg font-bold text-purple-400">
                      {gameState.wave}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Wave
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-400">
                      {gameState.zombies.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Hostiles
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-gold-400">
                  Mission Briefing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>🐑 Professional lamb defense operative</p>
                <p>💨 Advanced fart-propulsion weapons</p>
                <p>🧟 Eliminate all zombie threats</p>
                <p>⚡ Collect power-ups for tactical advantage</p>
                <p>🏆 Survive increasingly difficult waves</p>
                <p>🔊 Immersive audio combat feedback</p>
                <p className="text-gold-400 font-semibold">
                  This is definitely a serious military defense simulation and
                  not a joke.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  Weapon Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p>🔧 Primary: Fart-Propulsion Cannon</p>
                <p>⚡ Rate of Fire: 5 rounds/second</p>
                <p>🎯 Effective Range: Full battlefield</p>
                <p>💨 Ammunition: Unlimited methane</p>
                <p>🛡️ Armor: Fluffy wool protection</p>
                <p>🎮 Control: Precision arrow key targeting</p>
                <p className="text-xs text-muted-foreground">
                  *Weapon effects may cause uncontrollable laughter
                </p>
              </CardContent>
            </Card>

            {connected && (
              <Card className="glass-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Defense Force Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gold-400">
                        {personalBest}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your Best Defense Score
                      </div>
                    </div>
                    <div className="space-y-1">
                      {highScores.slice(0, 5).map((score, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {score.walletAddress.slice(0, 4)}...
                            {score.walletAddress.slice(-4)}
                          </span>
                          <span className="text-gold-400 font-semibold">
                            {score.score} (W{score.wave})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
