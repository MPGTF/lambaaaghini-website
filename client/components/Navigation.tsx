import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WalletConnection from "./WalletConnection";
import { Menu, X, ExternalLink } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Launchpad", path: "/launchpad" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "Whitepaper", path: "/whitepaper" },
  { name: "Team", path: "/team" },
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

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">LAMBAAAGHINI</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
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
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
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
            <WalletConnection variant="outline" />
            <Button
              asChild
              className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
            >
              <Link to="/launchpad">
                Launch App
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-background/95 backdrop-blur-md"
            >
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-gold-400 ${
                      location.pathname === item.path
                        ? "text-gold-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex flex-col space-y-4 pt-8">
                  <Button
                    asChild
                    variant="outline"
                    className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 justify-start"
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
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 justify-start"
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
                  <WalletConnection
                    variant="outline"
                    className="justify-start"
                  />
                  <Button
                    asChild
                    className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold justify-start"
                  >
                    <Link to="/launchpad" onClick={() => setIsOpen(false)}>
                      Launch App
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
