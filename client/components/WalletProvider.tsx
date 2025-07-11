import React, { useMemo, ErrorBoundary, Component } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: React.ReactNode;
}

class WalletErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Wallet provider error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log(
        "Wallet error boundary triggered, rendering children without wallet",
      );
      return this.props.children;
    }

    return this.props.children;
  }
}

export default function WalletProvider({ children }: WalletProviderProps) {
  try {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => {
      try {
        return [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter({ network }),
          new LedgerWalletAdapter(),
        ];
      } catch (error) {
        console.warn("Error initializing wallets:", error);
        return [];
      }
    }, [network]);

    // Error handling function
    const onError = (error: any) => {
      console.warn("Wallet error:", error);
      // Don't throw the error, just log it
    };

    return (
      <WalletErrorBoundary>
        <ConnectionProvider endpoint={endpoint}>
          <SolanaWalletProvider
            wallets={wallets}
            onError={onError}
            autoConnect={false}
          >
            <WalletModalProvider>{children}</WalletModalProvider>
          </SolanaWalletProvider>
        </ConnectionProvider>
      </WalletErrorBoundary>
    );
  } catch (error) {
    console.warn("Error in WalletProvider:", error);
    return <>{children}</>;
  }
}
