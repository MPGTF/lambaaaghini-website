import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Users,
  Crown,
  Shield,
  Wallet,
  Hash,
  Clock,
  Zap,
  RefreshCw,
  Star,
  Heart,
} from "lucide-react";

interface ChatMessage {
  id: string;
  walletAddress: string;
  walletShort: string;
  message: string;
  timestamp: number;
  timeFormatted: string;
  reactions?: { [key: string]: number };
}

const SHEEP_EMOJIS = [
  "🐑",
  "🐏",
  "🐩",
  "🦙",
  "🐪",
  "🦌",
  "🐾",
  "💨",
  "🏎️",
  "👑",
];

export default function LambSauce() {
  const { publicKey, connected } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages from localStorage on mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = localStorage.getItem("lamb_sauce_messages");
        if (stored) {
          const parsedMessages: ChatMessage[] = JSON.parse(stored);
          // Keep only last 100 messages for performance
          const recentMessages = parsedMessages.slice(-100);
          setMessages(recentMessages);
          localStorage.setItem(
            "lamb_sauce_messages",
            JSON.stringify(recentMessages),
          );
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();

    // Poll for new messages every 2 seconds to simulate real-time
    const interval = setInterval(loadMessages, 2000);

    // Simulate online users (random between 15-50)
    const updateOnlineUsers = () => {
      setOnlineUsers(Math.floor(Math.random() * 35) + 15);
    };
    updateOnlineUsers();
    const userInterval = setInterval(updateOnlineUsers, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(userInterval);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const shortenWallet = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getWalletEmoji = (address: string): string => {
    // Generate consistent emoji based on wallet address
    const index = address.charCodeAt(0) % SHEEP_EMOJIS.length;
    return SHEEP_EMOJIS[index];
  };

  const sendMessage = async () => {
    if (!connected || !publicKey) {
      toast.error("🐑 Connect your wallet to join the conversation!");
      return;
    }

    if (!newMessage.trim()) {
      toast.error("🐑 Please enter a message!");
      return;
    }

    if (newMessage.length > 280) {
      toast.error("🐑 Message too long! Keep it under 280 characters.");
      return;
    }

    setLoading(true);
    try {
      const timestamp = Date.now();
      const walletAddress = publicKey.toString();

      const message: ChatMessage = {
        id: `${walletAddress}_${timestamp}`,
        walletAddress,
        walletShort: shortenWallet(walletAddress),
        message: newMessage.trim(),
        timestamp,
        timeFormatted: formatTime(timestamp),
        reactions: {},
      };

      // Add message to current messages
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);

      // Save to localStorage
      localStorage.setItem(
        "lamb_sauce_messages",
        JSON.stringify(updatedMessages),
      );

      // Clear input
      setNewMessage("");

      toast.success("🐑 Message sent to the flock!");
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!connected) {
      toast.error("🐑 Connect wallet to react!");
      return;
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      }),
    );

    // Update localStorage
    const updated = messages.map((msg) => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    });
    localStorage.setItem("lamb_sauce_messages", JSON.stringify(updated));
  };

  const clearChat = () => {
    if (connected && publicKey) {
      localStorage.removeItem("lamb_sauce_messages");
      setMessages([]);
      toast.success("🐑 Chat cleared by shepherd!");
    }
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
            🐑💬 Live Community Chat - Where Sheep Flock Together
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-orange-400 drop-shadow-lg font-bold">
              LAMB
            </span>{" "}
            <span className="text-red-400 drop-shadow-lg font-bold">SAUCE</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The spiciest chat in the sheep community! Connect your wallet and
            join the conversation with fellow sheep and shepherds. Share alpha,
            memes, and pure sheep wisdom! 🐑🔥
          </p>

          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg px-4 py-2">
              <Users className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">
                {onlineUsers} Sheep Online
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-gold-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
              <MessageCircle className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">
                {messages.length} Messages Today
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Panel */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-orange-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    🔥 Live Sheep Chat
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      Live
                    </Badge>
                    {connected && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 max-h-[400px]"
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground text-lg mb-2">
                        No messages yet in the sauce!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Be the first sheep to start the conversation! 🐑💬
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 p-3 rounded-lg transition-all hover:bg-muted/20 ${
                          message.walletAddress === publicKey?.toString()
                            ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                            : "bg-gradient-to-r from-purple-500/5 to-blue-500/5"
                        }`}
                      >
                        <Avatar className="w-10 h-10 border-2 border-orange-500/30">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold">
                            {getWalletEmoji(message.walletAddress)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-orange-400">
                              {message.walletShort}
                            </span>
                            {message.walletAddress ===
                              publicKey?.toString() && (
                              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30 text-xs">
                                You
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.timeFormatted}
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed mb-2 break-words">
                            {message.message}
                          </p>

                          {/* Reactions */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {["🐑", "🔥", "💎", "🚀", "👑"].map((emoji) => (
                                <Button
                                  key={emoji}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 hover:bg-orange-500/20"
                                  onClick={() => addReaction(message.id, emoji)}
                                >
                                  <span className="text-xs">
                                    {emoji} {message.reactions?.[emoji] || ""}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-border/30 pt-4">
                  {!connected ? (
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Connect your wallet to join the conversation!
                        </p>
                      </div>
                      <WalletMultiButton className="!bg-gradient-to-r !from-orange-500 !to-red-600 hover:!from-orange-600 hover:!to-red-700 !text-white !font-semibold !border-0 !rounded-md !px-6 !py-3" />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="🐑 Share your thoughts with the flock..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        maxLength={280}
                        className="flex-1 border-orange-500/50 focus:border-orange-500"
                        disabled={loading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}

                  {connected && (
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>
                        💡 Tip: Press Enter to send • {280 - newMessage.length}{" "}
                        characters remaining
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Powered by Sheep Energy
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Chat Rules */}
            <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  🐑 Sheep Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Crown className="h-4 w-4 text-gold-400 mt-0.5" />
                  <div>
                    <p className="text-gold-400 font-semibold">Be Respectful</p>
                    <p className="text-muted-foreground text-xs">
                      Keep it friendly and sheep-appropriate
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Hash className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-semibold">No Spam</p>
                    <p className="text-muted-foreground text-xs">
                      Quality over quantity, fellow sheep
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-orange-400 font-semibold">Share Alpha</p>
                    <p className="text-muted-foreground text-xs">
                      Help your fellow sheep succeed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Heart className="h-4 w-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Have Fun</p>
                    <p className="text-muted-foreground text-xs">
                      This is where sheep come to party!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reactions */}
            <Card className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  🎭 Quick Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Click on messages to add these reactions:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {["🐑", "🔥", "💎", "🚀", "👑"].map((emoji) => (
                    <div
                      key={emoji}
                      className="text-center p-2 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <span className="text-lg">{emoji}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            {connected && (
              <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-all">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    🔗 Connected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {getWalletEmoji(publicKey?.toString() || "")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-400">
                          {shortenWallet(publicKey?.toString() || "")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your sheep avatar
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🐑 Lamb Sauce - Where the sheep community comes to chat, share, and
            build together! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
