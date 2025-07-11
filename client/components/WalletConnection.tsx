import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// Add type declaration for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: any }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: Function) => void;
      removeListener: (event: string, callback: Function) => void;
    };
  }
}

interface WalletConnectionProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export default function WalletConnection({
  variant = "outline",
  className = "",
}: WalletConnectionProps) {
  const { wallet, publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  console.log("WalletConnection render:", {
    wallet,
    publicKey,
    connected,
    setVisible,
  });

  const handleConnect = async () => {
    console.log("Connect wallet button clicked!");
    console.log("Available wallets:", wallet);
    console.log("setVisible function:", setVisible);

    try {
      // Try direct wallet connection first
      if (window.solana && window.solana.isPhantom) {
        console.log("Phantom detected, attempting direct connection");
        const response = await window.solana.connect();
        console.log("Phantom connection response:", response);
        toast.success("Phantom wallet connected!");
        return;
      }

      // Fallback to modal
      if (setVisible) {
        console.log("Opening wallet modal");
        setVisible(true);
      } else {
        console.error("setVisible is not available");
        toast.error("Wallet modal not available");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect wallet: " + error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error("Failed to disconnect wallet");
    }
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Address copied to clipboard");
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}`,
        "_blank",
      );
    }
  };

  if (!connected || !publicKey) {
    return (
      <Button
        onClick={handleConnect}
        variant={variant}
        className={`${
          variant === "outline"
            ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            : ""
        } ${className}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={`${
            variant === "outline"
              ? "border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              : ""
          } ${className}`}
        >
          <div className="flex items-center space-x-2">
            {wallet?.adapter.icon && (
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-4 h-4"
              />
            )}
            <span>{truncateAddress(publicKey.toBase58())}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-background/95 backdrop-blur-md border-border/50"
      >
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            {wallet?.adapter.icon && (
              <img
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                className="w-5 h-5"
              />
            )}
            <Badge
              variant="secondary"
              className="bg-gold-500/20 text-gold-400 border-gold-500/20"
            >
              {wallet?.adapter.name}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {publicKey.toBase58()}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View in Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
