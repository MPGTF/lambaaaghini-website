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

// Import default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: React.ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  // Use devnet for better connectivity during testing
  const network = WalletAdapterNetwork.Devnet;

  // Use a more reliable RPC endpoint
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return "https://api.devnet.solana.com";
    }
    return clusterApiUrl(network);
  }, [network]);

  // Only use the most common wallets to avoid compatibility issues
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  // Enhanced error handling function
  const onError = (error: any) => {
    console.error("Wallet error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={true}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
