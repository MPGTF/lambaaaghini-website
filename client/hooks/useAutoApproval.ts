import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

interface AutoApprovalSettings {
  enabled: boolean;
  readOnlyOperations: boolean;
  messageSignings: boolean;
  lowValueTransfers: boolean;
  maxAutoApproveAmount: number; // in SOL
}

const DEFAULT_SETTINGS: AutoApprovalSettings = {
  enabled: false,
  readOnlyOperations: true,
  messageSignings: true,
  lowValueTransfers: false,
  maxAutoApproveAmount: 0.01, // 0.01 SOL max for auto-approve
};

export function useAutoApproval() {
  const { connected, publicKey } = useWallet();
  const [settings, setSettings] =
    useState<AutoApprovalSettings>(DEFAULT_SETTINGS);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      const savedSettings = localStorage.getItem(
        `lambaaaghini_auto_approve_${walletAddress}`,
      );

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch (error) {
          console.error("Failed to parse auto-approval settings:", error);
        }
      }

      // Show welcome message for first-time users
      const hasSeenWelcome = localStorage.getItem(
        `lambaaaghini_welcome_${walletAddress}`,
      );
      if (!hasSeenWelcome && !hasShownWelcome) {
        setHasShownWelcome(true);
        localStorage.setItem(`lambaaaghini_welcome_${walletAddress}`, "true");

        setTimeout(() => {
          toast.success(
            "🐑 Welcome! Auto-approval enabled for safe operations",
            {
              description:
                "Message signing and read operations won't require confirmation",
              duration: 5000,
            },
          );

          // Enable safe auto-approvals by default
          const defaultSettings = {
            ...DEFAULT_SETTINGS,
            enabled: true,
            readOnlyOperations: true,
            messageSignings: true,
          };

          updateSettings(defaultSettings);
        }, 2000);
      }
    }
  }, [connected, publicKey, hasShownWelcome]);

  const updateSettings = (newSettings: Partial<AutoApprovalSettings>) => {
    if (!connected || !publicKey) return;

    const walletAddress = publicKey.toBase58();
    const updatedSettings = { ...settings, ...newSettings };

    setSettings(updatedSettings);
    localStorage.setItem(
      `lambaaaghini_auto_approve_${walletAddress}`,
      JSON.stringify(updatedSettings),
    );

    // Store global flag for quick access
    localStorage.setItem(
      "lambaaaghini_auto_approve",
      updatedSettings.enabled.toString(),
    );
  };

  const shouldAutoApprove = (
    operationType: string,
    amount?: number,
  ): boolean => {
    if (!settings.enabled) return false;

    switch (operationType) {
      case "read":
      case "balance":
      case "account_info":
        return settings.readOnlyOperations;

      case "sign_message":
      case "authentication":
        return settings.messageSignings;

      case "transfer":
      case "transaction":
        if (!settings.lowValueTransfers) return false;
        return amount ? amount <= settings.maxAutoApproveAmount : false;

      default:
        return false;
    }
  };

  const enableAutoApproval = () => {
    updateSettings({ enabled: true });
    toast.success("🤖 Auto-approval enabled for safe operations!");
  };

  const disableAutoApproval = () => {
    updateSettings({ enabled: false });
    toast.info("🔒 Auto-approval disabled - manual confirmation required");
  };

  const toggleAutoApproval = () => {
    if (settings.enabled) {
      disableAutoApproval();
    } else {
      enableAutoApproval();
    }
  };

  return {
    settings,
    updateSettings,
    shouldAutoApprove,
    enableAutoApproval,
    disableAutoApproval,
    toggleAutoApproval,
    isEnabled: settings.enabled,
  };
}
