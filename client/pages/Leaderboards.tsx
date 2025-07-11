import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Crown,
  Star,
  TrendingUp,
  Zap,
  Target,
  Award,
  Medal,
  Users,
  Calendar,
  RefreshCw,
  Flame,
  Diamond,
  Moon,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  username: string;
  score: number;
  avatar: string;
  achievements: number;
  streak: number;
  change: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    walletAddress: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
    username: "AlphaSheep",
    score: 15420,
    avatar: "👑",
    achievements: 28,
    streak: 15,
    change: 2,
  },
  {
    rank: 2,
    walletAddress: "4vMbnR7qL9w6Zu1zXg8Jf2QbYvwNfzZkzZuL3mN1oPqR",
    username: "DiamondHooves",
    score: 14890,
    avatar: "💎",
    achievements: 25,
    streak: 12,
    change: -1,
  },
  {
    rank: 3,
    walletAddress: "BqNpZ7kL9wQeRt3mN5pFg2hD4vMxY8uI1oP6rT9sW2eE",
    username: "MoonSheep",
    score: 13245,
    avatar: "🌙",
    achievements: 22,
    streak: 8,
    change: 1,
  },
  {
    rank: 4,
    walletAddress: "7yHgF3mK8pL2qW9eR5tU1nN4vB6zA9sD3fJ7kM5oP8qE",
    username: "GoldenFleece",
    score: 12780,
    avatar: "🐑",
    achievements: 20,
    streak: 6,
    change: 0,
  },
  {
    rank: 5,
    walletAddress: "3zKmN8pL5qW2eR9tY6uI1oP4rT7sW0dF5gH8jK1mN9pL",
    username: "SheepWhisperer",
    score: 11560,
    avatar: "🗣️",
    achievements: 18,
    streak: 9,
    change: 3,
  },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first trade",
    icon: "👶",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Diamond Hooves",
    description: "Hold a position for 30 days without selling",
    icon: "💎",
    rarity: "epic",
    progress: 25,
    maxProgress: 30,
    unlocked: false,
  },
  {
    id: "3",
    name: "Moon Sheep",
    description: "Achieve 1000% gains on a single trade",
    icon: "🌙",
    rarity: "legendary",
    progress: 650,
    maxProgress: 1000,
    unlocked: false,
  },
  {
    id: "4",
    name: "Social Sheep",
    description: "Send 100 messages in Lamb Sauce chat",
    icon: "💬",
    rarity: "rare",
    progress: 87,
    maxProgress: 100,
    unlocked: false,
  },
  {
    id: "5",
    name: "Fleece Master",
    description: "Complete 50 profitable trades",
    icon: "🏆",
    rarity: "epic",
    progress: 50,
    maxProgress: 50,
    unlocked: true,
    unlockedAt: new Date("2024-02-10"),
  },
  {
    id: "6",
    name: "Fire Sheep",
    description: "Maintain a 7-day trading streak",
    icon: "🔥",
    rarity: "rare",
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    unlockedAt: new Date("2024-02-20"),
  },
];

export default function Leaderboards() {
  const { publicKey, connected } = useWallet();
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [achievements, setAchievements] =
    useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "daily" | "weekly" | "monthly" | "allTime"
  >("weekly");
  const [userRank, setUserRank] = useState<number>(42);

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-500/30 text-gray-400";
      case "rare":
        return "border-blue-500/30 text-blue-400";
      case "epic":
        return "border-purple-500/30 text-purple-400";
      case "legendary":
        return "border-gold-500/30 text-gold-400";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-gold-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-400" />;
    return <span className="text-muted-foreground">-</span>;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const refreshLeaderboard = () => {
    // Simulate refresh with slight position changes
    const shuffled = [...leaderboard].map((entry, index) => ({
      ...entry,
      change: Math.floor(Math.random() * 6) - 3, // Random change between -3 and +3
    }));
    setLeaderboard(shuffled);
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-gold-500/10 text-gold-400 border-gold-500/20 hover:bg-gold-500/20">
            🏆👑 Sheep Leaderboards - Compete with the Flock Elite
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gold-400 drop-shadow-lg font-bold">
              SHEEP
            </span>{" "}
            <span className="text-purple-400 drop-shadow-lg font-bold">
              RANKINGS
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Climb the ranks, unlock achievements, and prove you're the ultimate
            alpha sheep! Compete with traders worldwide and show off your
            legendary trading skills! 🐑🏆
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gold-400 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    🏆 Top Sheep Traders
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTimeframe}
                      onChange={(e) =>
                        setSelectedTimeframe(
                          e.target.value as
                            | "daily"
                            | "weekly"
                            | "monthly"
                            | "allTime",
                        )
                      }
                      className="bg-background border border-gold-500/30 rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="allTime">All Time</option>
                    </select>
                    <Button
                      onClick={refreshLeaderboard}
                      variant="outline"
                      size="sm"
                      className="border-gold-500/50 text-gold-400 hover:bg-gold-500/20"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.walletAddress}
                      className={`p-4 rounded-lg transition-all ${
                        entry.rank <= 3
                          ? "bg-gradient-to-r from-gold-500/10 to-yellow-500/10 border border-gold-500/20"
                          : "bg-muted/20 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[60px]">
                          {getRankIcon(entry.rank)}
                          {getChangeIcon(entry.change)}
                        </div>

                        <Avatar className="w-12 h-12 border-2 border-gold-500/30">
                          <AvatarFallback className="bg-gradient-to-r from-gold-500 to-yellow-600 text-white text-lg">
                            {entry.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gold-400">
                              {entry.username}
                            </span>
                            {entry.rank === 1 && (
                              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                                Alpha Sheep
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shortenAddress(entry.walletAddress)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.achievements} achievements
                          </div>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="h-4 w-4" />
                            <span className="font-semibold">
                              {entry.streak}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            day streak
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {connected && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-purple-500/30">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                            🐑
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-purple-400">
                            Your Rank: #{userRank}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shortenAddress(publicKey?.toString() || "")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">8,420 points</div>
                        <div className="text-sm text-green-400">+156 today</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  🏅 Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border transition-all ${
                        achievement.unlocked
                          ? `${getRarityColor(achievement.rarity)} bg-gradient-to-r from-${achievement.rarity === "legendary" ? "gold" : achievement.rarity === "epic" ? "purple" : achievement.rarity === "rare" ? "blue" : "gray"}-500/10`
                          : "border-gray-500/20 bg-gray-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-semibold ${achievement.unlocked ? getRarityColor(achievement.rarity).split(" ")[1] : "text-gray-500"}`}
                          >
                            {achievement.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <Progress
                                value={
                                  (achievement.progress /
                                    achievement.maxProgress) *
                                  100
                                }
                                className="h-2"
                              />
                              <div className="text-xs text-muted-foreground mt-1">
                                {achievement.progress} /{" "}
                                {achievement.maxProgress}
                              </div>
                            </div>
                          )}
                          {achievement.unlocked && achievement.unlockedAt && (
                            <div className="text-xs text-green-400 mt-1">
                              Unlocked{" "}
                              {achievement.unlockedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  📊 Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Score</span>
                  <span className="font-bold">8,420</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Achievements</span>
                  <span className="font-bold">
                    {achievements.filter((a) => a.unlocked).length}/
                    {achievements.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-bold text-orange-400">12 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Rank</span>
                  <span className="font-bold text-gold-400">#23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sheep Since</span>
                  <span className="font-bold">Jan 2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Challenge */}
            <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  🎯 Monthly Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="font-bold text-orange-400 mb-2">
                    Reach the Moon
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Achieve 10,000 total points this month
                  </div>
                  <Progress value={84.2} className="mb-2" />
                  <div className="text-sm">8,420 / 10,000 points (84.2%)</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    6 days remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
