import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Timer, Star, ExternalLink, RefreshCw } from "lucide-react";

interface FeaturedToken {
  id: string;
  contractAddress: string;
  symbol: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  featuredUntil: number;
  paidAmount: number;
  submittedBy: string;
  timeRemaining?: string;
}

interface FeaturedTokensProps {
  onTokenSelect?: (token: any) => void;
  showTitle?: boolean;
  maxTokens?: number;
  className?: string;
}

export default function FeaturedTokens({
  onTokenSelect,
  showTitle = true,
  maxTokens = 10,
  className = "",
}: FeaturedTokensProps) {
  const [featuredTokens, setFeaturedTokens] = useState<FeaturedToken[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // Load featured tokens from localStorage
  useEffect(() => {
    const loadFeaturedTokens = () => {
      setLoadingFeatured(true);
      try {
        const stored = localStorage.getItem("lamb_featured_tokens");
        if (stored) {
          const tokens: FeaturedToken[] = JSON.parse(stored);
          // Filter out expired tokens
          const now = Date.now();
          const activeTokens = tokens.filter(
            (token) => token.featuredUntil > now,
          );

          // Update time remaining for each token
          const tokensWithTime = activeTokens.map((token) => ({
            ...token,
            timeRemaining: getTimeRemaining(token.featuredUntil),
          }));

          setFeaturedTokens(tokensWithTime);

          // Save back the filtered active tokens
          localStorage.setItem(
            "lamb_featured_tokens",
            JSON.stringify(activeTokens),
          );
        }
      } catch (error) {
        console.error("Failed to load featured tokens:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeaturedTokens();

    // Update every minute
    const interval = setInterval(loadFeaturedTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (featuredUntil: number): string => {
    const now = Date.now();
    const remaining = featuredUntil - now;

    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleTokenClick = (token: FeaturedToken) => {
    if (onTokenSelect) {
      // Convert to the format expected by token selection
      const tokenForSelection = {
        address: token.contractAddress,
        symbol: token.symbol,
        name: token.name,
        decimals: 6, // Default decimals
        logoURI: token.logoUrl,
      };
      onTokenSelect(tokenForSelection);
    }
  };

  return (
    <Card
      className={`glass-card border-gold-500/20 hover:border-gold-500/40 transition-all ${className}`}
    >
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-gold-400 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            🏆 Featured Tokens (Paid the Lamb)
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>Premium placements - 0.5 SOL each</span>
            {loadingFeatured && (
              <RefreshCw className="h-4 w-4 animate-spin text-gold-400" />
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={showTitle ? "" : "pt-6"}>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loadingFeatured ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gold-400 mr-2" />
              <span className="text-muted-foreground">
                Loading featured tokens...
              </span>
            </div>
          ) : featuredTokens.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">
                No featured tokens yet!
              </p>
              <p className="text-xs text-muted-foreground">
                Be the first to pay the Lamb! 🐑👑
              </p>
            </div>
          ) : (
            featuredTokens.slice(0, maxTokens).map((token) => (
              <div
                key={token.id}
                className={`bg-gradient-to-r from-gold-500/10 to-purple-500/10 border border-gold-500/20 rounded-lg p-4 transition-all ${
                  onTokenSelect
                    ? "hover:bg-gold-500/20 cursor-pointer hover:scale-[1.02]"
                    : "hover:bg-gold-500/15"
                }`}
                onClick={() => handleTokenClick(token)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={token.logoUrl}
                    alt={token.symbol}
                    className="w-12 h-12 rounded-full border-2 border-gold-500/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiMzNzM3MzciLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiIGZpbGw9IiM5CA0OTkiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gold-400">
                        {token.symbol}
                      </h3>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        {token.timeRemaining}
                      </Badge>
                      {onTokenSelect && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Click to Trade 🐑
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">
                      {token.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {token.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {token.websiteUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={token.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {token.twitterUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={token.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🐦
                          </a>
                        </Button>
                      )}
                      {token.telegramUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={token.telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📱
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
