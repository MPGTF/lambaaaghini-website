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

  const handleConnect = () => {
    console.log("Connect wallet button clicked!");
    console.log("Wallet modal setVisible:", setVisible);
    try {
      setVisible(true);
      console.log("Modal visibility set to true");
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to open wallet selector");
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
