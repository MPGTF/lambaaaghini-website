import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnection from "@/components/WalletConnection";

interface GameState {
  playerY: number;
  playerVelocityY: number;
  isJumping: boolean;
  jumpCharges: number;
  obstacles: Array<{
    x: number;
    height: number;
    width: number;
    id: number;
    justSpawned: boolean;
    type: "low" | "medium" | "high" | "floating";
  }>;
  score: number;
  gameRunning: boolean;
  gameOver: boolean;
  crashed: boolean;
  fartClouds: Array<{ x: number; y: number; id: number; opacity: number }>;
  explosions: Array<{ x: number; y: number; id: number; opacity: number }>;
  backgroundOffset: number;
}

interface HighScore {
  walletAddress: string;
  score: number;
  timestamp: number;
}

export default function Game() {
  const { connected, publicKey } = useWallet();
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [personalBest, setPersonalBest] = useState<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    playerY: 200, // Middle of the screen
    playerVelocityY: 0,
    isJumping: false,
    jumpCharges: 0,
    obstacles: [],
    score: 0,
    gameRunning: false,
    gameOver: false,
    crashed: false,
    fartClouds: [],
    explosions: [],
    backgroundOffset: 0,
  });

  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const fartIdRef = useRef(0);
  const explosionIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const GROUND_Y = 300;
  const GRAVITY = 0.6;
  const PLAYER_SIZE = 40;
  const PLAYER_X = 100; // Fixed player position
  const SCROLL_SPEED = 3;

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("lambaaaghini-high-scores");
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
    (score: number) => {
      if (!connected || !publicKey) return;

      const newScore: HighScore = {
        walletAddress: publicKey.toBase58(),
        score,
        timestamp: Date.now(),
      };

      const savedScores = localStorage.getItem("lambaaaghini-high-scores");
      const scores: HighScore[] = savedScores ? JSON.parse(savedScores) : [];
      scores.push(newScore);

      const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 50);
      localStorage.setItem(
        "lambaaaghini-high-scores",
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

  // Create crash sound effect
  const playCrashSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Create explosion sound with multiple oscillators
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          200 + i * 100,
          audioContext.currentTime,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          50,
          audioContext.currentTime + 0.5,
        );

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5,
        );

        oscillator.type = "square";
        oscillator.start(audioContext.currentTime + i * 0.1);
        oscillator.stop(audioContext.currentTime + 0.5 + i * 0.1);
      }
    } catch (error) {
      console.log("Audio not supported, but the game continues!");
    }
  }, []);

  const jump = useCallback(() => {
    if (!gameState.gameRunning || gameState.gameOver) return;

    playFartSound();

    setGameState((prev) => {
      const charges = prev.jumpCharges + 1;
      let jumpPower = 0;

      // Different jump heights based on charges
      if (charges === 1)
        jumpPower = -12; // Small jump
      else if (charges === 2)
        jumpPower = -16; // Medium jump
      else if (charges >= 3) jumpPower = -20; // High jump

      return {
        ...prev,
        playerVelocityY: jumpPower,
        isJumping: true,
        jumpCharges: charges,
        fartClouds: [
          ...prev.fartClouds,
          {
            x: PLAYER_X - 20,
            y: prev.playerY + 20,
            id: fartIdRef.current++,
            opacity: 1,
          },
        ],
      };
    });
  }, [gameState.gameRunning, gameState.gameOver, playFartSound]);

  const startGame = () => {
    setGameState({
      playerY: GROUND_Y - PLAYER_SIZE,
      playerVelocityY: 0,
      isJumping: false,
      jumpCharges: 0,
      obstacles: [],
      score: 0,
      gameRunning: true,
      gameOver: false,
      crashed: false,
      fartClouds: [],
      explosions: [],
      backgroundOffset: 0,
    });
  };

  const resetGame = () => {
    setGameState({
      playerY: GROUND_Y - PLAYER_SIZE,
      playerVelocityY: 0,
      isJumping: false,
      jumpCharges: 0,
      obstacles: [],
      score: 0,
      gameRunning: false,
      gameOver: false,
      crashed: false,
      fartClouds: [],
      explosions: [],
      backgroundOffset: 0,
    });
  };

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        let newPlayerY = prev.playerY;
        let newPlayerVelocityY = prev.playerVelocityY;
        let newIsJumping = prev.isJumping;
        let newJumpCharges = prev.jumpCharges;
        let newObstacles = [...prev.obstacles];
        let newScore = prev.score;
        let newGameOver = false;
        let newCrashed = false;

        // Apply gravity and update player position
        newPlayerVelocityY += GRAVITY;
        newPlayerY += newPlayerVelocityY;

        // Ground collision
        if (newPlayerY >= GROUND_Y - PLAYER_SIZE) {
          newPlayerY = GROUND_Y - PLAYER_SIZE;
          newPlayerVelocityY = 0;
          newIsJumping = false;
          newJumpCharges = 0; // Reset jump charges when landing
        }

        // Move obstacles and handle spawning animation
        newObstacles = newObstacles.map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - SCROLL_SPEED,
          justSpawned: false,
        }));

        // Remove obstacles that are off-screen
        newObstacles = newObstacles.filter(
          (obstacle) => obstacle.x > -obstacle.width,
        );

        // Check for collisions
        const playerRect = {
          x: PLAYER_X,
          y: newPlayerY,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
        };

        for (const obstacle of newObstacles) {
          const obstacleRect = {
            x: obstacle.x,
            y:
              obstacle.type === "floating"
                ? obstacle.height
                : GROUND_Y - obstacle.height,
            width: obstacle.width,
            height: obstacle.type === "floating" ? 40 : obstacle.height,
          };

          // Simple rectangle collision detection
          if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
          ) {
            // CRASH!
            newGameOver = true;
            newCrashed = true;
            playCrashSound();

            // Create explosion effect
            const newExplosions = prev.explosions.concat([
              {
                x: PLAYER_X,
                y: newPlayerY,
                id: explosionIdRef.current++,
                opacity: 1,
              },
            ]);

            // Save high score if connected
            if (connected && newScore > 0) {
              saveHighScore(newScore);
            }

            return {
              ...prev,
              playerY: newPlayerY,
              playerVelocityY: newPlayerVelocityY,
              gameOver: newGameOver,
              crashed: newCrashed,
              gameRunning: false,
              explosions: newExplosions,
            };
          }
        }

        // Spawn new obstacles
        const lastObstacle = newObstacles[newObstacles.length - 1];
        const minDistance = 200 + Math.random() * 150;

        if (!lastObstacle || GAME_WIDTH - lastObstacle.x > minDistance) {
          const obstacleTypes = ["low", "medium", "high", "floating"] as const;
          const type =
            obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

          let height = 60;
          let width = 40;

          if (type === "low") {
            height = 60;
          } else if (type === "medium") {
            height = 120;
          } else if (type === "high") {
            height = 180;
          } else if (type === "floating") {
            height = 100 + Math.random() * 100; // Y position for floating obstacles
            width = 60;
          }

          newObstacles.push({
            x: GAME_WIDTH,
            height,
            width,
            id: obstacleIdRef.current++,
            justSpawned: true,
            type,
          });
        }

        // Update fart clouds
        const newFartClouds = prev.fartClouds
          .map((cloud) => ({
            ...cloud,
            x: cloud.x - SCROLL_SPEED / 2,
            opacity: cloud.opacity - 0.02,
          }))
          .filter((cloud) => cloud.opacity > 0 && cloud.x > -50);

        // Update explosions
        const newExplosions = prev.explosions
          .map((explosion) => ({
            ...explosion,
            opacity: explosion.opacity - 0.03,
          }))
          .filter((explosion) => explosion.opacity > 0);

        // Increase score over time
        newScore += 1;

        return {
          ...prev,
          playerY: newPlayerY,
          playerVelocityY: newPlayerVelocityY,
          isJumping: newIsJumping,
          jumpCharges: newJumpCharges,
          obstacles: newObstacles,
          score: newScore,
          fartClouds: newFartClouds,
          explosions: newExplosions,
          backgroundOffset: (prev.backgroundOffset + SCROLL_SPEED) % 100,
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
  }, [gameState.gameRunning, playCrashSound, connected, saveHighScore]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!keysPressed.current.has("Space")) {
          keysPressed.current.add("Space");
          jump();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        keysPressed.current.delete("Space");
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
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            🏎️💨 Professional 2D Racing Simulator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gold-400 font-bold">LAMBAAAGHINI</span>{" "}
            <span className="text-purple-400 font-bold">PLATFORMER</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our cutting-edge 2D automotive simulation featuring
            advanced multi-height fart-propulsion jump technology and precision
            obstacle avoidance mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-center text-gold-400">
                  Professional 2D Racing Circuit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="relative mx-auto bg-gradient-to-b from-sky-400/20 via-sky-300/10 to-green-600/20 border-4 border-gold-500/30 overflow-hidden"
                  style={{
                    width: GAME_WIDTH,
                    height: GAME_HEIGHT,
                    imageRendering: "pixelated",
                  }}
                >
                  {/* Moving background pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 20px,
                          rgba(255,255,255,0.1) 20px,
                          rgba(255,255,255,0.1) 22px
                        )
                      `,
                      transform: `translateX(-${gameState.backgroundOffset}px)`,
                    }}
                  />

                  {/* Ground */}
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-700/40 to-green-600/20 border-t-2 border-green-500/50"
                    style={{ height: GAME_HEIGHT - GROUND_Y }}
                  />

                  {/* Player (Pixelated Lamb-Car) */}
                  <div
                    className="absolute transition-all duration-100 flex items-center justify-center text-2xl"
                    style={{
                      left: PLAYER_X,
                      top: gameState.playerY,
                      width: PLAYER_SIZE,
                      height: PLAYER_SIZE,
                      imageRendering: "pixelated",
                      filter: gameState.crashed
                        ? "hue-rotate(0deg) saturate(200%)"
                        : "none",
                    }}
                  >
                    <div
                      className={`transition-all duration-200 ${
                        gameState.isJumping ? "animate-pulse" : ""
                      } ${gameState.crashed ? "animate-ping" : ""}`}
                      style={{
                        imageRendering: "pixelated",
                        fontSize: "24px",
                        textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
                      }}
                    >
                      {gameState.crashed ? "💥🐑💥" : "🐑🏎️"}
                    </div>
                  </div>

                  {/* Jump charge indicator */}
                  {gameState.jumpCharges > 0 && !gameState.gameOver && (
                    <div
                      className="absolute text-sm font-bold text-gold-400 animate-bounce"
                      style={{
                        left: PLAYER_X + PLAYER_SIZE + 10,
                        top: gameState.playerY - 20,
                      }}
                    >
                      {"⚡".repeat(Math.min(gameState.jumpCharges, 3))}
                    </div>
                  )}

                  {/* Obstacles */}
                  {gameState.obstacles.map((obstacle) => (
                    <div
                      key={obstacle.id}
                      className={`absolute ${
                        obstacle.justSpawned ? "animate-ping" : ""
                      }`}
                      style={{
                        left: obstacle.x,
                        top:
                          obstacle.type === "floating"
                            ? obstacle.height
                            : GROUND_Y - obstacle.height,
                        width: obstacle.width,
                        height:
                          obstacle.type === "floating" ? 40 : obstacle.height,
                        backgroundColor:
                          obstacle.type === "floating"
                            ? "rgba(147, 51, 234, 0.7)"
                            : "rgba(239, 68, 68, 0.7)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        imageRendering: "pixelated",
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {obstacle.type === "floating" ? "☁️" : "🚧"}
                      </div>
                    </div>
                  ))}

                  {/* Fart Clouds */}
                  {gameState.fartClouds.map((cloud) => (
                    <div
                      key={cloud.id}
                      className="absolute text-xl animate-pulse pointer-events-none"
                      style={{
                        left: cloud.x,
                        top: cloud.y,
                        opacity: cloud.opacity,
                        imageRendering: "pixelated",
                      }}
                    >
                      💨
                    </div>
                  ))}

                  {/* Explosions */}
                  {gameState.explosions.map((explosion) => (
                    <div
                      key={explosion.id}
                      className="absolute text-3xl animate-ping pointer-events-none"
                      style={{
                        left: explosion.x,
                        top: explosion.y,
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
                      Start Professional 2D Racing
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
                        CRASH! Your lamb got totally rekt! 🐑💥
                      </div>
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4"
                      >
                        Try Again (You Got This)
                      </Button>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Press SPACEBAR multiple times for different jump heights
                    </p>
                    <p>
                      🐑 Small tap = Low jump | 🐑🐑 Double tap = Medium jump |
                      🐑🐑🐑 Triple+ tap = High jump
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
                      Professional Distance
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {gameState.jumpCharges}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Jump Charges
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">
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
                <p>🏎️ Your lamb-car moves automatically forward</p>
                <p>🚧 Avoid ground obstacles of different heights</p>
                <p>☁️ Duck under floating cloud obstacles</p>
                <p>💨 Multiple spacebar taps = higher jumps</p>
                <p>⚡ Landing resets your jump charges</p>
                <p>🔊 Advanced retro sound effects included</p>
                <p className="text-gold-400 font-semibold">
                  This is definitely a serious 2D racing simulator and not a
                  joke.
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
                <p>🔧 Engine: Multi-Stage Fart Propulsion</p>
                <p>⚡ Jump Heights: 3 Professional Levels</p>
                <p>🏁 Max Speed: Steady 3 pixels/frame</p>
                <p>💨 Emission Stages: Low, Med, High</p>
                <p>🛡️ Collision Detection: Pixel Perfect*</p>
                <p>🎮 Physics: Mario-Inspired Underwater</p>
                <p className="text-xs text-muted-foreground">
                  *Actually rectangle-based collision
                </p>
              </CardContent>
            </Card>

            {connected && (
              <Card className="glass-card border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Wallet Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gold-400">
                        {personalBest}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your Best Score
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
                            {score.score}
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
