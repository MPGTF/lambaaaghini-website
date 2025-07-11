import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface UserStats {
  tokensCreated: number;
  zombiesKilled: number;
  gamesPlayed: number;
  highScore: number;
  joinedDate: string;
}

interface UserData {
  walletAddress: string;
  stats: UserStats;
  title: string;
  level: number;
}

interface UserContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  incrementTokensCreated: () => void;
  incrementZombiesKilled: (count: number) => void;
  updateGameStats: (score: number) => void;
  getUserTitle: () => string;
  getTitleProgress: () => { current: string; next: string; progress: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Ridiculous zombie-killing titles with thresholds
const ZOMBIE_TITLES = [
  {
    threshold: 0,
    title: "Fluffy Lamb",
    description: "Just started the journey",
  },
  {
    threshold: 10,
    title: "Zombie Nibbler",
    description: "First taste of undead",
  },
  {
    threshold: 25,
    title: "Fart Warrior",
    description: "Learning the way of gas",
  },
  {
    threshold: 50,
    title: "Undead Snacker",
    description: "Developing a taste for brains",
  },
  {
    threshold: 100,
    title: "Zombie Chomper",
    description: "Getting serious about destruction",
  },
  {
    threshold: 200,
    title: "Apocalypse Lamb",
    description: "Bringing doom to the undead",
  },
  {
    threshold: 350,
    title: "Methane Master",
    description: "Weaponized digestive system",
  },
  {
    threshold: 500,
    title: "Fart-pocalypse",
    description: "Single-handedly clearing continents",
  },
  {
    threshold: 750,
    title: "Gassy Grim Reaper",
    description: "Death by digestive discord",
  },
  {
    threshold: 1000,
    title: "Zombie Annihilator",
    description: "The undead's worst nightmare",
  },
  {
    threshold: 1500,
    title: "Intestinal Devastator",
    description: "Biological warfare specialist",
  },
  {
    threshold: 2000,
    title: "Flatulent Overlord",
    description: "Ruler of all things gaseous",
  },
  {
    threshold: 3000,
    title: "Atomic Digestor",
    description: "Nuclear-level intestinal reactions",
  },
  {
    threshold: 4000,
    title: "Quantum Fart Lord",
    description: "Bending space-time with gas",
  },
  {
    threshold: 5000,
    title: "Cosmic Bowel Emperor",
    description: "Galactic digestive supremacy",
  },
  {
    threshold: 7500,
    title: "Interdimensional Toot Titan",
    description: "Breaking reality with burps",
  },
  {
    threshold: 10000,
    title: "Universal Gas God",
    description: "Creator and destroyer of atmospheres",
  },
  {
    threshold: 15000,
    title: "Omnipotent Fart Force",
    description: "Transcended physical form into pure gas",
  },
  {
    threshold: 20000,
    title: "The Great Digestive Deity",
    description: "Worshipped across all dimensions",
  },
  {
    threshold: 50000,
    title: "ULTIMATE LAMBAAAA DESTROYER",
    description: "Legend speaks of your epic gas attacks",
  },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<UserData | null>(null);

  // Load user data when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      loadOrCreateUser(walletAddress);
    } else {
      setUser(null);
    }
  }, [connected, publicKey]);

  const loadOrCreateUser = (walletAddress: string) => {
    const existingUserData = localStorage.getItem(`lambUser_${walletAddress}`);

    if (existingUserData) {
      const userData = JSON.parse(existingUserData);
      setUser(userData);
    } else {
      // Create new user
      const newUser: UserData = {
        walletAddress,
        stats: {
          tokensCreated: 0,
          zombiesKilled: 0,
          gamesPlayed: 0,
          highScore: 0,
          joinedDate: new Date().toISOString(),
        },
        title: ZOMBIE_TITLES[0].title,
        level: 1,
      };
      setUser(newUser);
      saveUserData(newUser);
    }
  };

  const saveUserData = (userData: UserData) => {
    localStorage.setItem(
      `lambUser_${userData.walletAddress}`,
      JSON.stringify(userData),
    );
  };

  const updateUserStats = (updater: (user: UserData) => UserData) => {
    if (!user) return;

    const updatedUser = updater(user);
    updatedUser.title = calculateTitle(updatedUser.stats.zombiesKilled);
    updatedUser.level = calculateLevel(updatedUser.stats.zombiesKilled);

    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const calculateTitle = (zombiesKilled: number): string => {
    for (let i = ZOMBIE_TITLES.length - 1; i >= 0; i--) {
      if (zombiesKilled >= ZOMBIE_TITLES[i].threshold) {
        return ZOMBIE_TITLES[i].title;
      }
    }
    return ZOMBIE_TITLES[0].title;
  };

  const calculateLevel = (zombiesKilled: number): number => {
    return Math.floor(zombiesKilled / 100) + 1;
  };

  const incrementTokensCreated = () => {
    updateUserStats((user) => ({
      ...user,
      stats: {
        ...user.stats,
        tokensCreated: user.stats.tokensCreated + 1,
      },
    }));
  };

  const incrementZombiesKilled = (count: number) => {
    updateUserStats((user) => ({
      ...user,
      stats: {
        ...user.stats,
        zombiesKilled: user.stats.zombiesKilled + count,
      },
    }));
  };

  const updateGameStats = (score: number) => {
    updateUserStats((user) => ({
      ...user,
      stats: {
        ...user.stats,
        gamesPlayed: user.stats.gamesPlayed + 1,
        highScore: Math.max(user.stats.highScore, score),
      },
    }));
  };

  const getUserTitle = (): string => {
    if (!user) return "Unknown Lamb";
    return user.title;
  };

  const getTitleProgress = () => {
    if (!user) {
      return {
        current: "Unknown Lamb",
        next: "Connect Wallet",
        progress: 0,
      };
    }

    const currentZombies = user.stats.zombiesKilled;
    let currentTitleIndex = 0;

    // Find current title index
    for (let i = ZOMBIE_TITLES.length - 1; i >= 0; i--) {
      if (currentZombies >= ZOMBIE_TITLES[i].threshold) {
        currentTitleIndex = i;
        break;
      }
    }

    const currentTitle = ZOMBIE_TITLES[currentTitleIndex];
    const nextTitle = ZOMBIE_TITLES[currentTitleIndex + 1];

    if (!nextTitle) {
      return {
        current: currentTitle.title,
        next: "MAX LEVEL ACHIEVED!",
        progress: 100,
      };
    }

    const progressToNext = currentZombies - currentTitle.threshold;
    const totalNeeded = nextTitle.threshold - currentTitle.threshold;
    const progress = Math.min(100, (progressToNext / totalNeeded) * 100);

    return {
      current: currentTitle.title,
      next: nextTitle.title,
      progress: Math.round(progress),
    };
  };

  const contextValue: UserContextType = {
    user,
    isLoggedIn: connected && user !== null,
    incrementTokensCreated,
    incrementZombiesKilled,
    updateGameStats,
    getUserTitle,
    getTitleProgress,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { ZOMBIE_TITLES };
