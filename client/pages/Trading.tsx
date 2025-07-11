import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  CandlestickChart,
} from "recharts";
import {
  Bell,
  Bot,
  TrendingUp,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  DollarSign,
  Activity,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  token: string;
  condition: "above" | "below";
  price: number;
  isActive: boolean;
  created: Date;
}

interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  isActive: boolean;
  profit: number;
  trades: number;
  winRate: number;
}

interface TradeHistory {
  id: string;
  type: "buy" | "sell";
  token: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

const MOCK_ALERTS: PriceAlert[] = [
  {
    id: "1",
    token: "SOL",
    condition: "above",
    price: 200,
    isActive: true,
    created: new Date(),
  },
  {
    id: "2",
    token: "FARTCOIN",
    condition: "below",
    price: 0.001,
    isActive: false,
    created: new Date(),
  },
];

const MOCK_BOTS: TradingBot[] = [
  {
    id: "1",
    name: "Sheep Scalper Pro",
    strategy: "Mean Reversion",
    isActive: true,
    profit: 12.34,
    trades: 45,
    winRate: 67.8,
  },
  {
    id: "2",
    name: "HODL Sheep",
    strategy: "DCA Strategy",
    isActive: false,
    profit: -2.15,
    trades: 12,
    winRate: 41.7,
  },
];

const MOCK_TRADES: TradeHistory[] = [
  {
    id: "1",
    type: "buy",
    token: "SOL",
    amount: 2.5,
    price: 191.5,
    total: 478.75,
    timestamp: new Date(),
    status: "completed",
  },
  {
    id: "2",
    type: "sell",
    token: "FARTCOIN",
    amount: 10000,
    price: 0.00085,
    total: 8.5,
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
  },
];

const CHART_DATA = [
  { time: "09:00", price: 190, volume: 1200 },
  { time: "10:00", price: 192, volume: 1500 },
  { time: "11:00", price: 188, volume: 900 },
  { time: "12:00", price: 195, volume: 2100 },
  { time: "13:00", price: 191, volume: 1800 },
  { time: "14:00", price: 193, volume: 1400 },
];

export default function Trading() {
  const { publicKey, connected } = useWallet();
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [bots, setBots] = useState<TradingBot[]>(MOCK_BOTS);
  const [trades, setTrades] = useState<TradeHistory[]>(MOCK_TRADES);
  const [newAlert, setNewAlert] = useState({
    token: "",
    condition: "above" as "above" | "below",
    price: "",
  });
  const [selectedBot, setSelectedBot] = useState<string>("");

  const createAlert = () => {
    if (!newAlert.token || !newAlert.price) {
      toast.error("🐑 Please fill in all alert fields!");
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      token: newAlert.token.toUpperCase(),
      condition: newAlert.condition,
      price: parseFloat(newAlert.price),
      isActive: true,
      created: new Date(),
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ token: "", condition: "above", price: "" });
    toast.success("🔔 Price alert created! You'll be notified when triggered.");
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert,
      ),
    );
  };

  const toggleBot = (id: string) => {
    setBots(
      bots.map((bot) =>
        bot.id === id ? { ...bot, isActive: !bot.isActive } : bot,
      ),
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success("🗑️ Alert deleted!");
  };

  return (
    <div className="min-h-screen px-6 py-20 relative">
      {/* Floating mini lamb car logos */}
      <div className="absolute top-40 right-10 opacity-20 animate-pulse pointer-events-none">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
          alt="Lambaaaghini"
          className="w-12 h-8 object-cover rounded-lg"
        />
      </div>
      <div
        className="absolute bottom-32 left-6 opacity-15 animate-bounce pointer-events-none"
        style={{ animationDelay: "1s" }}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
          alt="Lambaaaghini"
          className="w-10 h-6 object-cover rounded-lg"
        />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
            📊⚡ Advanced Trading Tools - Professional Sheep Trading Arsenal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-blue-400 drop-shadow-lg font-bold">
              TRADING
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">
              TOOLS
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
            Professional-grade trading tools for serious sheep! Set price
            alerts, deploy trading bots, analyze your performance, and trade
            like the alpha sheep you are! 🐑📈
          </p>
          {/* Medium lamb car image for trading inspiration */}
          <div className="flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=160"
              alt="Trading Goals - Lambaaaghini"
              className="w-24 h-15 object-cover rounded-lg opacity-70 hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        {!connected ? (
          <div className="text-center py-16">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to access advanced trading tools and
              analytics!
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-500 !to-blue-700 hover:!from-blue-600 hover:!to-blue-800 !text-white !font-semibold !border-0 !rounded-md !px-8 !py-4" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Alerts
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {alerts.filter((a) => a.isActive).length}
                      </p>
                    </div>
                    <Bell className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Running Bots
                      </p>
                      <p className="text-2xl font-bold text-blue-400">
                        {bots.filter((b) => b.isActive).length}
                      </p>
                    </div>
                    <Bot className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Today's Trades
                      </p>
                      <p className="text-2xl font-bold text-purple-400">
                        {trades.length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bot P&L</p>
                      <p className="text-2xl font-bold text-gold-400">
                        +$
                        {bots
                          .reduce((sum, bot) => sum + bot.profit, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-gold-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Price Alerts */}
              <Card className="glass-card border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    🔔 Price Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Token Symbol</Label>
                      <Input
                        placeholder="e.g., SOL, FARTCOIN"
                        value={newAlert.token}
                        onChange={(e) =>
                          setNewAlert({ ...newAlert, token: e.target.value })
                        }
                        className="border-yellow-500/30"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Condition</Label>
                        <Select
                          value={newAlert.condition}
                          onValueChange={(value: "above" | "below") =>
                            setNewAlert({ ...newAlert, condition: value })
                          }
                        >
                          <SelectTrigger className="border-yellow-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="above">Above</SelectItem>
                            <SelectItem value="below">Below</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Price ($)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newAlert.price}
                          onChange={(e) =>
                            setNewAlert({ ...newAlert, price: e.target.value })
                          }
                          className="border-yellow-500/30"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={createAlert}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Create Alert
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {alert.token} {alert.condition} ${alert.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created {alert.created.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trading Bots */}
              <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    🤖 Trading Bots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {bots.map((bot) => (
                      <div
                        key={bot.id}
                        className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-blue-400">
                            {bot.name}
                          </div>
                          <Switch
                            checked={bot.isActive}
                            onCheckedChange={() => toggleBot(bot.id)}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Strategy: {bot.strategy}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">P&L</div>
                            <div
                              className={
                                bot.profit >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {bot.profit >= 0 ? "+" : ""}$
                              {bot.profit.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Trades</div>
                            <div className="text-white">{bot.trades}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Win Rate
                            </div>
                            <div className="text-green-400">{bot.winRate}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Bots
                  </Button>
                </CardContent>
              </Card>

              {/* Trading Performance Chart */}
              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    📊 Live Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(147, 51, 234, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#A855F7"
                        strokeWidth={2}
                        dot={{ fill: "#A855F7", strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Trade History */}
            <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  📈 Recent Trade History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-3 text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left py-3 text-muted-foreground">
                          Token
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Price
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Total
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Time
                        </th>
                        <th className="text-right py-3 text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => (
                        <tr
                          key={trade.id}
                          className="border-b border-border/10 hover:bg-muted/10"
                        >
                          <td className="py-4">
                            <Badge
                              className={
                                trade.type === "buy"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {trade.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 font-semibold">{trade.token}</td>
                          <td className="text-right py-4 font-mono">
                            {trade.amount.toLocaleString()}
                          </td>
                          <td className="text-right py-4 font-mono">
                            ${trade.price.toFixed(6)}
                          </td>
                          <td className="text-right py-4 font-mono font-semibold">
                            ${trade.total.toFixed(2)}
                          </td>
                          <td className="text-right py-4 text-sm text-muted-foreground">
                            {trade.timestamp.toLocaleTimeString()}
                          </td>
                          <td className="text-right py-4">
                            <div className="flex justify-end">
                              {trade.status === "completed" ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : trade.status === "pending" ? (
                                <Clock className="h-4 w-4 text-yellow-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
