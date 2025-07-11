import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import { toast } from "sonner";

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

interface PlayerProfile {
  walletAddress: string;
  gasBalance: number;
  currentTitle: string;
  titleLevel: number;
  totalGasEarned: number;
}

interface StatusTitle {
  level: number;
  title: string;
  cost: number;
  description: string;
}

// Status titles with increasingly silly names
const STATUS_TITLES: StatusTitle[] = [
  {
    level: 0,
    title: "Sheep Newbie",
    cost: 0,
    description: "Fresh lamb on the field",
  },
  {
    level: 1,
    title: "Fart Apprentice",
    cost: 100,
    description: "Learning the ways of the wind",
  },
  {
    level: 2,
    title: "Methane Warrior",
    cost: 300,
    description: "Battle-tested in gas warfare",
  },
  {
    level: 3,
    title: "Toxic Cloud Commander",
    cost: 600,
    description: "Leading armies of airborne assault",
  },
  {
    level: 4,
    title: "Supreme Stink Lord",
    cost: 1200,
    description: "Master of olfactory destruction",
  },
  {
    level: 5,
    title: "Legendary Butt Blaster",
    cost: 2500,
    description: "Your name is whispered in fear",
  },
  {
    level: 6,
    title: "Mythical Wind Wizard",
    cost: 5000,
    description: "Controls the very essence of flatulence",
  },
  {
    level: 7,
    title: "Cosmic Gas Giant",
    cost: 10000,
    description: "A planetary force of nature",
  },
  {
    level: 8,
    title: "Interdimensional Fart Emperor",
    cost: 20000,
    description: "Rules over multiple gaseous universes",
  },
  {
    level: 9,
    title: "Ultimate Sheep Deity of Eternal Stench",
    cost: 50000,
    description: "The final form of lamb evolution",
  },
];

export default function Game() {
  const { connected, publicKey } = useWallet();
  const { incrementZombiesKilled, updateGameStats, getUserTitle } = useUser();
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    null,
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  // Mobile movement states
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const isMovingLeftRef = useRef(false);
  const isMovingRightRef = useRef(false);

  // Fullscreen and orientation states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_Y = 550;
  const PLAYER_SIZE = 40;
  const PLAYER_SPEED = 7; // Increased for smoother movement
  const FART_SPEED = 8;
  const ZOMBIE_SIZE = 30;

  // Load high scores and player profile from localStorage
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

    // Load player profile
    if (connected && publicKey) {
      loadPlayerProfile(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  // Load player profile from localStorage
  const loadPlayerProfile = (walletAddress: string) => {
    const savedProfiles = localStorage.getItem("lambaaaghini-player-profiles");
    const profiles: PlayerProfile[] = savedProfiles
      ? JSON.parse(savedProfiles)
      : [];

    let profile = profiles.find((p) => p.walletAddress === walletAddress);

    if (!profile) {
      // Create new profile
      profile = {
        walletAddress,
        gasBalance: 0,
        currentTitle: STATUS_TITLES[0].title,
        titleLevel: 0,
        totalGasEarned: 0,
      };
      profiles.push(profile);
      localStorage.setItem(
        "lambaaaghini-player-profiles",
        JSON.stringify(profiles),
      );
    }

    setPlayerProfile(profile);
  };

  // Save player profile to localStorage
  const savePlayerProfile = (profile: PlayerProfile) => {
    const savedProfiles = localStorage.getItem("lambaaaghini-player-profiles");
    const profiles: PlayerProfile[] = savedProfiles
      ? JSON.parse(savedProfiles)
      : [];

    const index = profiles.findIndex(
      (p) => p.walletAddress === profile.walletAddress,
    );
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem(
      "lambaaaghini-player-profiles",
      JSON.stringify(profiles),
    );
    setPlayerProfile(profile);
  };

  // Save high score and award gas tokens
  const saveHighScore = useCallback(
    (score: number, wave: number) => {
      if (!connected || !publicKey || !playerProfile) return;

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

      // Award gas tokens based on performance
      const gasEarned = Math.floor(score / 100) + wave * 10; // 1 gas per 100 points + 10 gas per wave
      const updatedProfile: PlayerProfile = {
        ...playerProfile,
        gasBalance: playerProfile.gasBalance + gasEarned,
        totalGasEarned: playerProfile.totalGasEarned + gasEarned,
      };

      savePlayerProfile(updatedProfile);
    },
    [connected, publicKey, playerProfile],
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

  // Upgrade player title
  const upgradeTitle = (newLevel: number) => {
    if (!playerProfile || !connected) return;

    const newTitle = STATUS_TITLES[newLevel];
    if (
      !newTitle ||
      playerProfile.gasBalance < newTitle.cost ||
      newLevel <= playerProfile.titleLevel
    )
      return;

    const updatedProfile: PlayerProfile = {
      ...playerProfile,
      gasBalance: playerProfile.gasBalance - newTitle.cost,
      currentTitle: newTitle.title,
      titleLevel: newLevel,
    };

    savePlayerProfile(updatedProfile);
    setShowUpgradeModal(false);
  };

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
        let zombiesKilledThisFrame = 0;
        let newPlayerPowerUp = newPowerUpTime > 0 ? prev.playerPowerUp : null;
        let newExplosions = [...prev.explosions];
        let newFartBombCooldown = Math.max(0, prev.fartBombCooldown - 16);
        let newFartBombs = [...prev.fartBombs];

        // Player movement with smoother controls
        const baseSpeed = PLAYER_SPEED;
        const speed =
          prev.playerPowerUp === "speed" ? baseSpeed * 1.5 : baseSpeed;

        // Smooth boundary checking with padding
        const leftBoundary = PLAYER_SIZE / 2 + 5;
        const rightBoundary = GAME_WIDTH - PLAYER_SIZE / 2 - 5;

        // Apply movement with clamping to boundaries (keyboard or mobile buttons)
        if (keysPressed.current.has("ArrowLeft") || isMovingLeftRef.current) {
          newPlayerX = Math.max(leftBoundary, newPlayerX - speed);
        }
        if (keysPressed.current.has("ArrowRight") || isMovingRightRef.current) {
          newPlayerX = Math.min(rightBoundary, newPlayerX + speed);
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

        // Update fart bombs
        newFartBombs = newFartBombs
          .map((bomb) => {
            if (bomb.expanding && bomb.radius < bomb.maxRadius) {
              return { ...bomb, radius: bomb.radius + 8 };
            } else if (bomb.expanding) {
              return { ...bomb, expanding: false };
            } else {
              return { ...bomb, radius: Math.max(0, bomb.radius - 5) };
            }
          })
          .filter((bomb) => bomb.radius > 0);

        // Check fart bomb collisions with zombies
        newFartBombs.forEach((bomb) => {
          newZombies = newZombies.filter((zombie) => {
            const distance = Math.sqrt(
              Math.pow(bomb.x - zombie.x, 2) + Math.pow(bomb.y - zombie.y, 2),
            );
            if (distance < bomb.radius) {
              // Zombie hit by fart bomb
              newScore +=
                zombie.type === "tank" ? 50 : zombie.type === "fast" ? 30 : 20;
              zombiesKilledThisFrame++;
              playExplosionSound();

              // Add explosion effect
              newExplosions.push({
                x: zombie.x,
                y: zombie.y,
                id: explosionIdRef.current++,
                opacity: 1,
              });

              return false;
            }
            return true;
          });
        });

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
                zombiesKilledThisFrame++;
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
          // Update user game stats
          updateGameStats(newScore);
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
          fartBombCooldown: newFartBombCooldown,
          fartBombs: newFartBombs,
        };

        // Track zombie kills if any
        if (zombiesKilledThisFrame > 0) {
          incrementZombiesKilled(zombiesKilledThisFrame);
        }
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

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!gameContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await gameContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
        // Request landscape orientation on mobile
        if ("screen" in window && "orientation" in window.screen) {
          try {
            await (window.screen.orientation as any).lock("landscape");
          } catch (e) {
            console.log("Orientation lock not supported");
          }
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        // Unlock orientation
        if ("screen" in window && "orientation" in window.screen) {
          try {
            (window.screen.orientation as any).unlock();
          } catch (e) {
            console.log("Orientation unlock not supported");
          }
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const isCurrentlyLandscape = window.innerHeight < window.innerWidth;
      setIsLandscape(isCurrentlyLandscape);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Initial check
    handleOrientationChange();

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle keyboard input (arrow keys only) with improved responsiveness
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault(); // Prevent page scrolling
        keysPressed.current.add(event.code);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault();
        keysPressed.current.delete(event.code);
      }
    };

    // Add focus to ensure keyboard events are captured
    const handleFocus = () => {
      // Clear all keys when window loses/gains focus to prevent stuck keys
      keysPressed.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className={`min-h-screen transition-all duration-300 ${
        isFullscreen ? "bg-black p-2" : "px-6 py-20"
      } ${
        isFullscreen && isLandscape
          ? "landscape:flex landscape:flex-col landscape:justify-center"
          : ""
      }`}
    >
      <div
        className={`mx-auto ${isFullscreen ? "max-w-none h-full" : "max-w-6xl"}`}
      >
        {/* Header - Hidden in fullscreen landscape mode on mobile */}
        <div
          className={`text-center mb-12 ${
            isFullscreen && isLandscape && window.innerWidth < 768
              ? "hidden"
              : ""
          }`}
        >
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

        <div
          className={`grid gap-8 ${
            isFullscreen && isLandscape
              ? "grid-cols-1 xl:grid-cols-3 h-full"
              : "grid-cols-1 lg:grid-cols-4"
          }`}
        >
          {/* Game Area */}
          <div
            className={
              isFullscreen && isLandscape ? "xl:col-span-2" : "lg:col-span-3"
            }
          >
            <Card className="glass-card border-gold-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-center text-gold-400 flex-1">
                  Professional Defense Perimeter
                </CardTitle>
                <div className="flex gap-2">
                  {/* Orientation hint for mobile */}
                  <Button
                    onClick={() => {
                      if (
                        "screen" in window &&
                        "orientation" in window.screen
                      ) {
                        try {
                          (window.screen.orientation as any).lock("landscape");
                        } catch (e) {
                          toast.error(
                            "Please rotate your device to landscape mode manually",
                          );
                        }
                      } else {
                        toast.info(
                          "💡 Tip: Rotate your device horizontally for better gameplay!",
                        );
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="md:hidden border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  {/* Fullscreen button */}
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative mx-auto bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-green-900/20 border-4 border-gold-500/30 overflow-hidden ${
                    isFullscreen && isLandscape ? "max-w-full max-h-[70vh]" : ""
                  }`}
                  style={{
                    width:
                      isFullscreen && isLandscape
                        ? Math.min(GAME_WIDTH, window.innerWidth - 100)
                        : GAME_WIDTH,
                    height:
                      isFullscreen && isLandscape
                        ? Math.min(GAME_HEIGHT, window.innerHeight * 0.7)
                        : GAME_HEIGHT,
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
                    className="absolute transition-all duration-75 ease-out flex items-center justify-center text-3xl"
                    style={{
                      left: gameState.playerX - PLAYER_SIZE / 2,
                      top: PLAYER_Y - PLAYER_SIZE / 2,
                      width: PLAYER_SIZE,
                      height: PLAYER_SIZE,
                      imageRendering: "pixelated",
                      filter: gameState.playerPowerUp
                        ? "drop-shadow(0 0 10px gold)"
                        : "none",
                      transform: "rotate(270deg)", // Rotate lamb clockwise 90 degrees
                      willChange: "transform", // Optimize for animations
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
                          ? "🧟‍��️"
                          : zombie.type === "fast"
                            ? "���‍♀️"
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

                  {/* Fart Bombs */}
                  {gameState.fartBombs.map((bomb) => (
                    <div
                      key={bomb.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: bomb.x - bomb.radius,
                        top: bomb.y - bomb.radius,
                        width: bomb.radius * 2,
                        height: bomb.radius * 2,
                        borderRadius: "50%",
                        backgroundColor: "rgba(139, 69, 19, 0.6)",
                        border: "3px solid rgba(255, 165, 0, 0.8)",
                        opacity: bomb.expanding
                          ? 0.8
                          : bomb.radius / bomb.maxRadius,
                        imageRendering: "pixelated",
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        💨
                      </div>
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
                <div className="mt-8 text-center space-y-6 game-control-area">
                  {!gameState.gameRunning && !gameState.gameOver && (
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold px-8 py-4 text-lg"
                    >
                      Begin Defense Protocol
                    </Button>
                  )}

                  {gameState.gameRunning && (
                    <div className="space-y-6">
                      {/* Mobile-Optimized Movement Controls */}
                      <div className="flex justify-center gap-8 mb-8">
                        <button
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMovingLeft(true);
                            isMovingLeftRef.current = true;
                            // Add haptic feedback if available
                            if (navigator.vibrate) navigator.vibrate(50);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMovingLeft(false);
                            isMovingLeftRef.current = false;
                          }}
                          onTouchCancel={(e) => {
                            e.preventDefault();
                            setIsMovingLeft(false);
                            isMovingLeftRef.current = false;
                          }}
                          onMouseDown={() => {
                            setIsMovingLeft(true);
                            isMovingLeftRef.current = true;
                          }}
                          onMouseUp={() => {
                            setIsMovingLeft(false);
                            isMovingLeftRef.current = false;
                          }}
                          onMouseLeave={() => {
                            setIsMovingLeft(false);
                            isMovingLeftRef.current = false;
                          }}
                          className={`touch-manipulation select-none bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 active:from-blue-700 active:to-blue-900 text-white font-bold rounded-lg transition-all duration-150 min-w-[80px] min-h-[80px] flex items-center justify-center text-3xl shadow-lg border-2 border-blue-400/50 ${
                            isMovingLeft
                              ? "scale-95 brightness-125 shadow-xl border-blue-300"
                              : "hover:scale-105"
                          }`}
                          style={{
                            WebkitTouchCallout: "none",
                            WebkitUserSelect: "none",
                            touchAction: "manipulation",
                          }}
                        >
                          ←
                        </button>

                        <button
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMovingRight(true);
                            isMovingRightRef.current = true;
                            // Add haptic feedback if available
                            if (navigator.vibrate) navigator.vibrate(50);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMovingRight(false);
                            isMovingRightRef.current = false;
                          }}
                          onTouchCancel={(e) => {
                            e.preventDefault();
                            setIsMovingRight(false);
                            isMovingRightRef.current = false;
                          }}
                          onMouseDown={() => {
                            setIsMovingRight(true);
                            isMovingRightRef.current = true;
                          }}
                          onMouseUp={() => {
                            setIsMovingRight(false);
                            isMovingRightRef.current = false;
                          }}
                          onMouseLeave={() => {
                            setIsMovingRight(false);
                            isMovingRightRef.current = false;
                          }}
                          className={`touch-manipulation select-none bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 active:from-blue-700 active:to-blue-900 text-white font-bold rounded-lg transition-all duration-150 min-w-[80px] min-h-[80px] flex items-center justify-center text-3xl shadow-lg border-2 border-blue-400/50 ${
                            isMovingRight
                              ? "scale-95 brightness-125 shadow-xl border-blue-300"
                              : "hover:scale-105"
                          }`}
                          style={{
                            WebkitTouchCallout: "none",
                            WebkitUserSelect: "none",
                            touchAction: "manipulation",
                          }}
                        >
                          →
                        </button>
                      </div>

                      {/* Mobile-Optimized Action Controls */}
                      <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                        <button
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsFiring(true);
                            isFiringRef.current = true;
                            // Stronger haptic for primary action
                            if (navigator.vibrate)
                              navigator.vibrate([50, 50, 50]);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsFiring(false);
                            isFiringRef.current = false;
                          }}
                          onTouchCancel={(e) => {
                            e.preventDefault();
                            setIsFiring(false);
                            isFiringRef.current = false;
                          }}
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
                          className={`touch-manipulation select-none bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 active:from-purple-700 active:to-purple-900 text-white font-bold rounded-lg transition-all duration-150 px-8 py-4 text-lg shadow-lg border-2 border-purple-400/50 min-h-[70px] ${
                            isFiring
                              ? "scale-95 brightness-125 shadow-xl border-purple-300"
                              : "hover:scale-105"
                          }`}
                          style={{
                            WebkitTouchCallout: "none",
                            WebkitUserSelect: "none",
                            touchAction: "manipulation",
                          }}
                        >
                          💨 FIRE FARTS 💨
                        </button>

                        <button
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (gameState.fartBombCooldown === 0) {
                              launchFartBomb();
                              // Special haptic for bomb
                              if (navigator.vibrate)
                                navigator.vibrate([100, 50, 100]);
                            }
                          }}
                          onClick={() => {
                            if (gameState.fartBombCooldown === 0) {
                              launchFartBomb();
                            }
                          }}
                          disabled={gameState.fartBombCooldown > 0}
                          className={`touch-manipulation select-none bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 active:from-red-700 active:to-red-900 text-white font-bold rounded-lg transition-all duration-150 px-6 py-4 text-lg shadow-lg border-2 border-red-400/50 min-h-[70px] ${
                            gameState.fartBombCooldown > 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:scale-105"
                          }`}
                          style={{
                            WebkitTouchCallout: "none",
                            WebkitUserSelect: "none",
                            touchAction: "manipulation",
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <span>💥 FART BOMB 💥</span>
                            {gameState.fartBombCooldown > 0 && (
                              <span className="text-xs">
                                {Math.ceil(gameState.fartBombCooldown / 1000)}s
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
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
                    <p className="text-gold-400 font-semibold">
                      📱 Mobile: Tap and hold buttons | 💻 Desktop: Use ARROW
                      KEYS
                    </p>
                    <p>Hold FIRE BUTTON to auto-fire fart projectiles</p>
                    <p>
                      💥 FART BOMB button for massive area damage (45s cooldown)
                    </p>
                    <p>
                      💨 Earn GAS TOKENS: 1 per 100 points + 10 per wave
                      completed
                    </p>
                    <p>🏆 Spend gas to upgrade your status to silly titles!</p>
                    <p>
                      🧟 Normal Zombies | �����♀️ Fast Zombies | 🧟‍♂️ Tank Zombies
                      (3 hits)
                    </p>
                    <p>
                      ⚡ Speed Boost | 🔫 Triple Shot | 💥 Big Fart Power-ups
                    </p>
                    <p className="text-xs text-purple-400">
                      💡 Mobile Tip: Hold buttons firmly, release to stop action
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
                  {connected && (
                    <div className="text-center bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-lg p-3 border border-gold-500/30">
                      <Badge className="mb-2 bg-gold-500/20 text-gold-400 border-gold-500/30">
                        {getUserTitle()}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Current Rank
                      </div>
                    </div>
                  )}
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

            {connected && playerProfile && (
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-400">
                    Player Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gold-400 mb-1">
                        {playerProfile.currentTitle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current Status
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-400">
                        💨 {playerProfile.gasBalance}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Gas Tokens
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => setShowUpgradeModal(true)}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white text-xs"
                      >
                        Upgrade Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                <p>�� Effective Range: Full battlefield</p>
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

        {/* Status Upgrade Modal */}
        {showUpgradeModal && connected && playerProfile && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <Card
              className="glass-card border-gold-500/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl font-bold"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                <CardTitle className="text-gold-400 text-center">
                  💨 Gas Station - Status Upgrades 💨
                </CardTitle>
                <div className="text-center text-sm text-muted-foreground">
                  Current Balance: {playerProfile.gasBalance} Gas Tokens
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {STATUS_TITLES.map((title, index) => {
                    const isOwned = index <= playerProfile.titleLevel;
                    const canAfford = playerProfile.gasBalance >= title.cost;
                    const isNext = index === playerProfile.titleLevel + 1;

                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          isOwned
                            ? "border-green-500/50 bg-green-500/10"
                            : canAfford && isNext
                              ? "border-gold-500/50 bg-gold-500/10"
                              : "border-gray-500/50 bg-gray-500/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3
                              className={`font-bold ${
                                isOwned
                                  ? "text-green-400"
                                  : canAfford && isNext
                                    ? "text-gold-400"
                                    : "text-gray-400"
                              }`}
                            >
                              {title.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {title.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-semibold ${
                                isOwned
                                  ? "text-green-400"
                                  : canAfford
                                    ? "text-gold-400"
                                    : "text-gray-400"
                              }`}
                            >
                              {title.cost === 0 ? "FREE" : `💨 ${title.cost}`}
                            </div>
                          </div>
                        </div>
                        {isOwned && index === playerProfile.titleLevel && (
                          <div className="text-xs text-green-400 font-semibold">
                            ✓ CURRENT STATUS
                          </div>
                        )}
                        {!isOwned && canAfford && isNext && (
                          <Button
                            onClick={() => upgradeTitle(index)}
                            size="sm"
                            className="bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-black font-semibold"
                          >
                            Upgrade Now
                          </Button>
                        )}
                        {!isOwned && (!canAfford || !isNext) && (
                          <div className="text-xs text-gray-400">
                            {!isNext
                              ? "Unlock previous titles first"
                              : "Not enough gas tokens"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowUpgradeModal(false)}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    Close Gas Station
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
