import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

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

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_Y = 550;
  const PLAYER_SIZE = 40;
  const PLAYER_SPEED = 7;
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
      const gasEarned = Math.floor(score / 100) + wave * 10;
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
          fartBombCooldown: newFartBombCooldown,
          fartBombs: newFartBombs,
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

  // Handle keyboard input (arrow keys only) with improved responsiveness
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault();
        keysPressed.current.add(event.code);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault();
        keysPressed.current.delete(event.code);
      }
    };

    const handleFocus = () => {
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

  const containerStyle = {
    minHeight: "100vh",
    padding: "20px",
    paddingTop: "80px",
    backgroundColor: "#0a0a0b",
    color: "#fafafa",
  };

  const cardStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(250, 204, 20, 0.2)",
    borderRadius: "12px",
    padding: "24px",
    margin: "8px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.2s",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #facc14, #f59e0b)",
    color: "#000",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    color: "#fff",
  };

  const gameAreaStyle = {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    margin: "0 auto",
    position: "relative" as const,
    backgroundColor: "rgba(16, 16, 32, 0.8)",
    border: "4px solid rgba(250, 204, 20, 0.3)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              backgroundColor: "rgba(250, 204, 20, 0.1)",
              color: "#facc14",
              padding: "8px 16px",
              borderRadius: "20px",
              display: "inline-block",
              marginBottom: "24px",
              border: "1px solid rgba(250, 204, 20, 0.2)",
            }}
          >
            🐑💨 Professional Galactic Defense Simulator
          </div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #facc14, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            LAMBAAAGHINI DEFENSE FORCE
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.8,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Defend the Solana ecosystem against the incoming zombie apocalypse
            using our cutting-edge fart-propulsion weapon systems.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "24px",
          }}
        >
          {/* Game Area */}
          <div style={cardStyle}>
            <h2
              style={{
                textAlign: "center",
                color: "#facc14",
                marginBottom: "24px",
              }}
            >
              Professional Defense Perimeter
            </h2>

            <div style={gameAreaStyle}>
              {/* Stars background */}
              <div style={{ position: "absolute", inset: "0" }}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: "2px",
                      height: "2px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random(),
                    }}
                  />
                ))}
              </div>

              {/* Player (Lamb) */}
              <div
                style={{
                  position: "absolute",
                  left: gameState.playerX - PLAYER_SIZE / 2,
                  top: PLAYER_Y - PLAYER_SIZE / 2,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  transform: "rotate(270deg)",
                  filter: gameState.playerPowerUp
                    ? "drop-shadow(0 0 10px gold)"
                    : "none",
                  transition: "all 0.075s ease-out",
                }}
              >
                🐑
              </div>

              {/* Power-up indicator */}
              {gameState.playerPowerUp && (
                <div
                  style={{
                    position: "absolute",
                    left: gameState.playerX + 20,
                    top: PLAYER_Y - 30,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#facc14",
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
                  style={{
                    position: "absolute",
                    left: fart.x - 10,
                    top: fart.y - 10,
                    fontSize: "20px",
                  }}
                >
                  💨
                </div>
              ))}

              {/* Zombies */}
              {gameState.zombies.map((zombie) => (
                <div
                  key={zombie.id}
                  style={{
                    position: "absolute",
                    left: zombie.x - ZOMBIE_SIZE / 2,
                    top: zombie.y - ZOMBIE_SIZE / 2,
                    width: ZOMBIE_SIZE,
                    height: ZOMBIE_SIZE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    filter:
                      zombie.type === "tank"
                        ? "drop-shadow(0 0 5px red)"
                        : zombie.type === "fast"
                          ? "drop-shadow(0 0 5px yellow)"
                          : "none",
                  }}
                >
                  {zombie.type === "tank"
                    ? "🧟‍♂️"
                    : zombie.type === "fast"
                      ? "🧟‍♀️"
                      : "🧟"}
                </div>
              ))}

              {/* Power-ups */}
              {gameState.powerUps.map((powerUp) => (
                <div
                  key={powerUp.id}
                  style={{
                    position: "absolute",
                    left: powerUp.x - 15,
                    top: powerUp.y - 15,
                    fontSize: "20px",
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
                  style={{
                    position: "absolute",
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  💨
                </div>
              ))}

              {/* Explosions */}
              {gameState.explosions.map((explosion) => (
                <div
                  key={explosion.id}
                  style={{
                    position: "absolute",
                    left: explosion.x - 15,
                    top: explosion.y - 15,
                    fontSize: "30px",
                    opacity: explosion.opacity,
                  }}
                >
                  💥
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              {!gameState.gameRunning && !gameState.gameOver && (
                <button onClick={startGame} style={primaryButtonStyle}>
                  Begin Defense Protocol
                </button>
              )}

              {gameState.gameRunning && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  {/* Movement Controls */}
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
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
                      onTouchStart={() => {
                        setIsMovingLeft(true);
                        isMovingLeftRef.current = true;
                      }}
                      onTouchEnd={() => {
                        setIsMovingLeft(false);
                        isMovingLeftRef.current = false;
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        fontSize: "24px",
                        backgroundColor: isMovingLeft ? "#7c3aed" : "#8b5cf6",
                      }}
                    >
                      ←
                    </button>

                    <button
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
                      onTouchStart={() => {
                        setIsMovingRight(true);
                        isMovingRightRef.current = true;
                      }}
                      onTouchEnd={() => {
                        setIsMovingRight(false);
                        isMovingRightRef.current = false;
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        fontSize: "24px",
                        backgroundColor: isMovingRight ? "#7c3aed" : "#8b5cf6",
                      }}
                    >
                      →
                    </button>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
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
                      style={{
                        ...secondaryButtonStyle,
                        backgroundColor: isFiring ? "#7c3aed" : "#8b5cf6",
                      }}
                    >
                      💨 FIRE FARTS 💨
                    </button>

                    <button
                      onClick={launchFartBomb}
                      disabled={gameState.fartBombCooldown > 0}
                      style={{
                        ...buttonStyle,
                        background:
                          gameState.fartBombCooldown > 0
                            ? "rgba(239, 68, 68, 0.5)"
                            : "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "#fff",
                        opacity: gameState.fartBombCooldown > 0 ? 0.5 : 1,
                        cursor:
                          gameState.fartBombCooldown > 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      💥 FART BOMB 💥
                      {gameState.fartBombCooldown > 0 && (
                        <div style={{ fontSize: "12px" }}>
                          {Math.ceil(gameState.fartBombCooldown / 1000)}s
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {gameState.gameOver && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ef4444",
                      marginBottom: "16px",
                    }}
                  >
                    Defense Perimeter Breached! Wave {gameState.wave} reached!
                    ����💥
                  </div>
                  <button onClick={resetGame} style={primaryButtonStyle}>
                    Rebuild Defense Force
                  </button>
                </div>
              )}

              <div
                style={{
                  marginTop: "16px",
                  fontSize: "14px",
                  opacity: 0.7,
                  lineHeight: "1.5",
                }}
              >
                <p>Use ARROW KEYS or tap ← → buttons to move</p>
                <p>Hold FIRE BUTTON to auto-fire fart projectiles</p>
                <p>
                  💥 FART BOMB button for massive area damage (45s cooldown)
                </p>
                <p>
                  💨 Earn GAS TOKENS: 1 per 100 points + 10 per wave completed
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Info Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div style={cardStyle}>
              <h3 style={{ color: "#a855f7", marginBottom: "16px" }}>
                Combat Metrics
              </h3>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#facc14",
                  }}
                >
                  {gameState.score}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.7 }}>
                  Eliminations
                </div>
              </div>
              <div
                style={{
                  marginTop: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#22c55e",
                    }}
                  >
                    {gameState.lives}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>Lives</div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#a855f7",
                    }}
                  >
                    {gameState.wave}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>Wave</div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#ef4444",
                    }}
                  >
                    {gameState.zombies.length}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>Hostiles</div>
                </div>
              </div>
            </div>

            {connected && playerProfile && (
              <div style={cardStyle}>
                <h3 style={{ color: "#f97316", marginBottom: "16px" }}>
                  Player Status
                </h3>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#facc14",
                      marginBottom: "8px",
                    }}
                  >
                    {playerProfile.currentTitle}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#f97316",
                    }}
                  >
                    💨 {playerProfile.gasBalance}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    Gas Tokens
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    style={{
                      ...secondaryButtonStyle,
                      fontSize: "12px",
                      padding: "8px 16px",
                      marginTop: "12px",
                    }}
                  >
                    Upgrade Status
                  </button>
                </div>
              </div>
            )}

            {connected && (
              <div style={cardStyle}>
                <h3 style={{ color: "#22c55e", marginBottom: "16px" }}>
                  Leaderboard
                </h3>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#facc14",
                    }}
                  >
                    {personalBest}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    Your Best Score
                  </div>
                </div>
                <div style={{ fontSize: "12px" }}>
                  {highScores.slice(0, 5).map((score, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>
                        {score.walletAddress.slice(0, 4)}...
                        {score.walletAddress.slice(-4)}
                      </span>
                      <span style={{ color: "#facc14", fontWeight: "600" }}>
                        {score.score} (W{score.wave})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Upgrade Modal */}
        {showUpgradeModal && connected && playerProfile && (
          <div
            style={{
              position: "fixed",
              inset: "0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "16px",
            }}
          >
            <div
              style={{
                ...cardStyle,
                maxWidth: "600px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  color: "#facc14",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                💨 Gas Station - Status Upgrades 💨
              </h2>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  opacity: 0.7,
                  marginBottom: "24px",
                }}
              >
                Current Balance: {playerProfile.gasBalance} Gas Tokens
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {STATUS_TITLES.map((title, index) => {
                  const isOwned = index <= playerProfile.titleLevel;
                  const canAfford = playerProfile.gasBalance >= title.cost;
                  const isNext = index === playerProfile.titleLevel + 1;

                  return (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        border: `1px solid ${
                          isOwned
                            ? "rgba(34, 197, 94, 0.5)"
                            : canAfford && isNext
                              ? "rgba(250, 204, 20, 0.5)"
                              : "rgba(107, 114, 128, 0.5)"
                        }`,
                        backgroundColor: `${
                          isOwned
                            ? "rgba(34, 197, 94, 0.1)"
                            : canAfford && isNext
                              ? "rgba(250, 204, 20, 0.1)"
                              : "rgba(107, 114, 128, 0.1)"
                        }`,
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "8px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontWeight: "bold",
                              color: isOwned
                                ? "#22c55e"
                                : canAfford && isNext
                                  ? "#facc14"
                                  : "#9ca3af",
                            }}
                          >
                            {title.title}
                          </h3>
                          <p style={{ fontSize: "14px", opacity: 0.7 }}>
                            {title.description}
                          </p>
                        </div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: isOwned
                              ? "#22c55e"
                              : canAfford
                                ? "#facc14"
                                : "#9ca3af",
                          }}
                        >
                          {title.cost === 0 ? "FREE" : `💨 ${title.cost}`}
                        </div>
                      </div>
                      {isOwned && index === playerProfile.titleLevel && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#22c55e",
                            fontWeight: "600",
                          }}
                        >
                          ✓ CURRENT STATUS
                        </div>
                      )}
                      {!isOwned && canAfford && isNext && (
                        <button
                          onClick={() => upgradeTitle(index)}
                          style={primaryButtonStyle}
                        >
                          Upgrade Now
                        </button>
                      )}
                      {!isOwned && (!canAfford || !isNext) && (
                        <div style={{ fontSize: "12px", opacity: 0.7 }}>
                          {!isNext
                            ? "Unlock previous titles first"
                            : "Not enough gas tokens"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  style={{
                    ...buttonStyle,
                    border: "1px solid rgba(168, 85, 247, 0.5)",
                    backgroundColor: "transparent",
                    color: "#a855f7",
                  }}
                >
                  Close Gas Station
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
