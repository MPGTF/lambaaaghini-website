import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useUser } from "@/contexts/UserContext";
import { Menu, X, ExternalLink, Trophy, Zap, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

// Primary navigation items
const primaryNavItems = [
  { name: "Home", path: "/" },
  { name: "DEX", path: "/dex" },
  { name: "Trading", path: "/trading" },
  { name: "Portfolio", path: "/portfolio" },
];

// Secondary navigation items
const secondaryNavItems = [
  { name: "Academy", path: "/academy" },
  { name: "Leaderboards", path: "/leaderboards" },
  { name: "News", path: "/news" },
];

// Community navigation items
const communityNavItems = [
  { name: "Lamb Sauce", path: "/lamb-sauce" },
  { name: "Pay the Lamb", path: "/pay-the-lamb" },
  { name: "Lamb Pooper Scooper", path: "/lamb-pooper-scooper" },
  { name: "Game", path: "/game" },
];

// Custom X (formerly Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom Fartbook Icon Component
const FartbookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8 10.5l2.5 2.5L8 15.5V10.5zm8 5L13.5 13 16 10.5V15.5zm-4 2.5L9.5 16 12 13.5 14.5 16 12 18z" />
    <circle cx="12" cy="9" r="1.5" fill="currentColor" opacity="0.7" />
    <circle cx="9" cy="12" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" opacity="0.6" />
  </svg>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isLoggedIn, getUserTitle, autoApproval } = useUser();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">LAMBAAAGHINI</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-gold-400 ${
                  location.pathname === item.path
                    ? "text-gold-400"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Dropdown for secondary items */}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors flex items-center">
                More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-gold-400 hover:bg-gold-500/10 ${
                        location.pathname === item.path
                          ? "text-gold-400 bg-gold-500/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-border/30 my-2"></div>
                  {communityNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-purple-400 hover:bg-purple-500/10 ${
                        location.pathname === item.path
                          ? "text-purple-400 bg-purple-500/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-gold-400 transition-colors"
            >
              <a
                href="https://x.com/lambaaaghini?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <a
                href="https://www.fartbook.us/profile/2jvWaa0H0UYVzJfEBqHcKiHEbFr2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Fartbook"
              >
                <FartbookIcon className="w-5 h-5" />
              </a>
            </Button>
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-4 !py-2" />
            {isLoggedIn && user && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gold-500/20 to-purple-500/20 backdrop-blur-sm border border-gold-500/30 rounded-lg px-3 py-2">
                <Trophy className="h-4 w-4 text-gold-400" />
                <div className="flex flex-col">
                  <Badge className="text-xs bg-gold-500/20 text-gold-400 border-gold-500/30 mb-1">
                    {getUserTitle()}
                  </Badge>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>🐑 {user.stats.zombiesKilled}</span>
                      <span>🚀 {user.stats.tokensCreated}</span>
                    </div>
                    <button
                      onClick={autoApproval.toggleAutoApproval}
                      className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                        autoApproval.isEnabled
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                      title={`Auto-approval: ${autoApproval.isEnabled ? "ON" : "OFF"}`}
                    >
                      <Settings className="h-3 w-3" />
                      <span>{autoApproval.isEnabled ? "Auto" : "Manual"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Launch App Dropdown */}
            <div className="relative group">
              <Button className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold flex items-center">
                Launch App
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
              <div className="absolute top-full right-0 mt-1 w-64 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gold-400 uppercase tracking-wider border-b border-border/30">
                    Trading & DeFi
                  </div>
                  <Link
                    to="/dex"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-gold-400 hover:bg-gold-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">⚡</span>
                    <div>
                      <div className="font-semibold">DEX Trading</div>
                      <div className="text-xs text-muted-foreground">
                        Swap tokens instantly
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/trading"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-blue-400 hover:bg-blue-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="font-semibold">Advanced Trading</div>
                      <div className="text-xs text-muted-foreground">
                        Alerts, bots & charts
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/portfolio"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-purple-400 hover:bg-purple-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">💼</span>
                    <div>
                      <div className="font-semibold">Portfolio</div>
                      <div className="text-xs text-muted-foreground">
                        Track your investments
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/launchpad"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-red-400 hover:bg-red-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">🚀</span>
                    <div>
                      <div className="font-semibold">Token Launchpad</div>
                      <div className="text-xs text-muted-foreground">
                        Create new tokens
                      </div>
                    </div>
                  </Link>

                  <div className="px-3 py-2 text-xs font-semibold text-purple-400 uppercase tracking-wider border-b border-t border-border/30 mt-2">
                    Utilities & Tools
                  </div>
                  <Link
                    to="/lamb-pooper-scooper"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-green-400 hover:bg-green-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">🐑</span>
                    <div>
                      <div className="font-semibold">Lamb Pooper Scooper</div>
                      <div className="text-xs text-muted-foreground">
                        Clean up SOL dust
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/pay-the-lamb"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-orange-400 hover:bg-orange-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">💰</span>
                    <div>
                      <div className="font-semibold">Pay the Lamb</div>
                      <div className="text-xs text-muted-foreground">
                        Feature your tokens
                      </div>
                    </div>
                  </Link>

                  <div className="px-3 py-2 text-xs font-semibold text-green-400 uppercase tracking-wider border-b border-t border-border/30 mt-2">
                    Community & Fun
                  </div>
                  <Link
                    to="/lamb-sauce"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-orange-400 hover:bg-orange-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">💬</span>
                    <div>
                      <div className="font-semibold">Lamb Sauce Chat</div>
                      <div className="text-xs text-muted-foreground">
                        Community discussion
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/game"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:text-purple-400 hover:bg-purple-500/10 text-muted-foreground"
                  >
                    <span className="text-lg">🎮</span>
                    <div>
                      <div className="font-semibold">Sheep vs Zombies</div>
                      <div className="text-xs text-muted-foreground">
                        Play & earn tokens
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-background/95 backdrop-blur-md"
            >
              <div className="flex flex-col space-y-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
                    Main
                  </h3>
                  {primaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-lg font-medium transition-colors hover:text-gold-400 ${
                        location.pathname === item.path
                          ? "text-gold-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                    Learn & Compete
                  </h3>
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-lg font-medium transition-colors hover:text-purple-400 ${
                        location.pathname === item.path
                          ? "text-purple-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Community
                  </h3>
                  {communityNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-lg font-medium transition-colors hover:text-green-400 ${
                        location.pathname === item.path
                          ? "text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {isLoggedIn && user && (
                  <div className="bg-gradient-to-r from-gold-500/20 to-purple-500/20 backdrop-blur-sm border border-gold-500/30 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Trophy className="h-5 w-5 text-gold-400" />
                      <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                        {getUserTitle()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>🐑</span>
                        <span className="text-muted-foreground">Zombies:</span>
                        <span className="text-purple-400 font-semibold">
                          {user.stats.zombiesKilled}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="text-gold-400 font-semibold">
                          {user.stats.tokensCreated}
                        </span>
                      </div>
                    </div>
                    {isLoggedIn && (
                      <div className="mt-3 pt-3 border-t border-gold-500/30">
                        <button
                          onClick={autoApproval.toggleAutoApproval}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded transition-colors ${
                            autoApproval.isEnabled
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">Auto-Approval</span>
                          </div>
                          <span className="text-xs font-semibold">
                            {autoApproval.isEnabled ? "ON" : "OFF"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-8 border-t border-border/30">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect Your Wallet
                    </p>
                    <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-4 !py-2 !justify-start !w-full !min-h-[50px]" />
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Launch Apps
                    </p>
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold justify-start min-h-[50px] w-full"
                      >
                        <Link to="/dex" onClick={() => setIsOpen(false)}>
                          <span className="text-lg mr-2">⚡</span>
                          DEX Trading
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 justify-start min-h-[50px] w-full"
                      >
                        <Link to="/trading" onClick={() => setIsOpen(false)}>
                          <span className="text-lg mr-2">📊</span>
                          Advanced Trading
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 justify-start min-h-[50px] w-full"
                      >
                        <Link to="/portfolio" onClick={() => setIsOpen(false)}>
                          <span className="text-lg mr-2">💼</span>
                          Portfolio
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 justify-start min-h-[50px] w-full"
                      >
                        <Link to="/launchpad" onClick={() => setIsOpen(false)}>
                          <span className="text-lg mr-2">🚀</span>
                          Token Launchpad
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/10 justify-start min-h-[50px] w-full"
                      >
                        <Link
                          to="/lamb-pooper-scooper"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-lg mr-2">🐑</span>
                          Lamb Pooper Scooper
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm text-muted-foreground mb-4">
                      Follow Us
                    </p>
                    <div className="flex flex-col space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 justify-start min-h-[50px]"
                      >
                        <a
                          href="https://x.com/lambaaaghini?s=21"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                        >
                          <XIcon className="w-4 h-4 mr-2" />
                          Follow us on X
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 justify-start min-h-[50px]"
                      >
                        <a
                          href="https://www.fartbook.us/profile/2jvWaa0H0UYVzJfEBqHcKiHEbFr2"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                        >
                          <FartbookIcon className="w-4 h-4 mr-2" />
                          Follow us on Fartbook
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
