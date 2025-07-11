import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Trophy,
  Target,
  Zap,
  Star,
  Crown,
  RefreshCw,
  BarChart3,
  Users,
  Award,
} from "lucide-react";

interface PortfolioToken {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  logoUrl: string;
}

interface FlockPerformance {
  totalValue: number;
  totalGain: number;
  gainPercentage: number;
  bestPerformer: string;
  worstPerformer: string;
  sheepRank: string;
  achievements: string[];
}

const MOCK_PORTFOLIO: PortfolioToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    balance: 12.5,
    value: 2387.5,
    price: 191.0,
    change24h: 5.2,
    logoUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    symbol: "FARTCOIN",
    name: "Fartcoin",
    balance: 1000000,
    value: 850.0,
    price: 0.00085,
    change24h: 23.7,
    logoUrl:
      "https://dd.dexscreener.com/ds-data/tokens/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump.png",
  },
  {
    symbol: "URANUS",
    name: "Uranus",
    balance: 50000,
    value: 420.69,
    price: 0.0084138,
    change24h: -12.3,
    logoUrl:
      "https://dd.dexscreener.com/ds-data/tokens/solana/BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE.png",
  },
  {
    symbol: "LAMB",
    name: "LambCoin",
    balance: 25000,
    value: 312.5,
    price: 0.0125,
    change24h: 69.42,
    logoUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRkQ3MDAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+Cjwvc3ZnPgo=",
  },
];

const PERFORMANCE_DATA = [
  { date: "Jan", value: 2500 },
  { date: "Feb", value: 3200 },
  { date: "Mar", value: 2800 },
  { date: "Apr", value: 3900 },
  { date: "May", value: 4200 },
  { date: "Jun", value: 3970.69 },
];

const COLORS = ["#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#3B82F6"];

export default function Portfolio() {
  const { publicKey, connected } = useWallet();
  const [portfolio, setPortfolio] = useState<PortfolioToken[]>(MOCK_PORTFOLIO);
  const [loading, setLoading] = useState(false);
  const [flockPerformance, setFlockPerformance] = useState<FlockPerformance>({
    totalValue: 3970.69,
    totalGain: 470.69,
    gainPercentage: 13.44,
    bestPerformer: "LAMB (+69.42%)",
    worstPerformer: "URANUS (-12.3%)",
    sheepRank: "Alpha Sheep",
    achievements: ["Diamond Hooves", "Moon Sheep", "Fleece Master"],
  });

  const calculateTotalValue = () => {
    return portfolio.reduce((sum, token) => sum + token.value, 0);
  };

  const getPortfolioDistribution = () => {
    return portfolio.map((token) => ({
      name: token.symbol,
      value: token.value,
      percentage: ((token.value / calculateTotalValue()) * 100).toFixed(1),
    }));
  };

  const getSheepRankColor = (rank: string) => {
    switch (rank) {
      case "Alpha Sheep":
        return "text-purple-400";
      case "Beta Sheep":
        return "text-blue-400";
      case "Gamma Sheep":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const refreshPortfolio = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate data refresh with slight variations
      const updatedPortfolio = portfolio.map((token) => ({
        ...token,
        change24h: token.change24h + (Math.random() - 0.5) * 5,
      }));
      setPortfolio(updatedPortfolio);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
            🐑📊 Flock Performance Dashboard - Track Your Sheep Wealth
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-purple-400 drop-shadow-lg font-bold">
              SHEEP
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">
              PORTFOLIO
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Monitor your flock's financial performance with professional
            sheep-grade analytics. Track gains, analyze holdings, and see how
            you rank among fellow sheep! 🐑📈
          </p>
        </div>

        {!connected ? (
          <div className="text-center py-16">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to view your sheep portfolio and track your
              flock performance!
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-8 !py-4" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    Total Flock Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    ${flockPerformance.totalValue.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      flockPerformance.gainPercentage >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {flockPerformance.gainPercentage >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {flockPerformance.gainPercentage >= 0 ? "+" : ""}$
                    {flockPerformance.totalGain.toFixed(2)} (
                    {flockPerformance.gainPercentage}%)
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gold-400 flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4" />
                    Sheep Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-xl font-bold ${getSheepRankColor(flockPerformance.sheepRank)}`}
                  >
                    {flockPerformance.sheepRank}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Top 15% of flock
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Best Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-400">
                    {flockPerformance.bestPerformer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Moon sheep detected! 🚀
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-red-500/20 hover:border-red-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-400 flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-red-400">
                    {flockPerformance.worstPerformer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Consider rotation 🔄
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Portfolio Performance Chart */}
              <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      🐑 Flock Performance (6M)
                    </div>
                    <Button
                      onClick={refreshPortfolio}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={PERFORMANCE_DATA}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Portfolio Distribution */}
              <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    🎯 Flock Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPortfolioDistribution()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percentage }) =>
                          `${name} ${percentage}%`
                        }
                      >
                        {getPortfolioDistribution().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          `$${value.toFixed(2)}`,
                          "Value",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(251, 146, 60, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Holdings Table */}
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  🐑 Current Flock Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-3 text-muted-foreground">
                          Token
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Balance
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Price
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Value
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((token) => (
                        <tr
                          key={token.symbol}
                          className="border-b border-border/10 hover:bg-muted/10"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={token.logoUrl}
                                alt={token.symbol}
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                              <div>
                                <div className="font-semibold text-white">
                                  {token.symbol}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {token.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-4 font-mono">
                            {token.balance.toLocaleString()}
                          </td>
                          <td className="text-right py-4 font-mono">
                            ${token.price.toFixed(token.price < 1 ? 6 : 2)}
                          </td>
                          <td className="text-right py-4 font-mono font-semibold">
                            ${token.value.toFixed(2)}
                          </td>
                          <td className="text-right py-4">
                            <span
                              className={`font-semibold ${
                                token.change24h >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {token.change24h >= 0 ? "+" : ""}
                              {token.change24h.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  🏆 Sheep Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {flockPerformance.achievements.map((achievement, index) => (
                    <div
                      key={achievement}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-gold-500/10 to-yellow-500/10 border border-gold-500/20 rounded-lg"
                    >
                      <div className="text-2xl">
                        {index === 0 ? "💎" : index === 1 ? "🌙" : "🏆"}
                      </div>
                      <div>
                        <div className="font-semibold text-gold-400">
                          {achievement}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Unlocked!
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
