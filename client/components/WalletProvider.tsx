import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";

// Import default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: React.ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  // Use mainnet for production
  const network = WalletAdapterNetwork.Mainnet;

  // Use a reliable RPC endpoint
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet) {
      return "https://api.mainnet-beta.solana.com";
    }
    return clusterApiUrl(network);
  }, [network]);

  // Only use the most common wallets to avoid compatibility issues
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  // Enhanced error handling function with auto-approval logic
  const onError = (error: any) => {
    console.error("Wallet error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    // Handle auto-approval for certain safe operations
    if (error.message?.includes("User rejected")) {
      // Only show rejection message for actual rejections, not auto-approved operations
      if (!localStorage.getItem("lambaaaghini_auto_approve")) {
        toast.error("🐑 Wallet operation rejected");
      }
    }
  };

  // Auto-approval configuration
  const walletConfig = useMemo(() => {
    return {
      // Enable auto-connect for seamless login
      autoConnect: true,
      // Store auto-approval preference
      localStorageKey: "lambaaaghini_wallet_state",
    };
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={walletConfig.autoConnect}
        localStorageKey={walletConfig.localStorageKey}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
