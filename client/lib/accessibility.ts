// Accessibility configuration for external libraries
// This helps suppress accessibility warnings from third-party components
// that we cannot directly control

export const configureAccessibility = () => {
  // Override console.warn to filter out specific accessibility warnings
  // from external libraries that we cannot fix directly
  const originalWarn = console.warn;

  console.warn = (...args: any[]) => {
    const message = args.join(" ");

    // Filter out known accessibility warnings from wallet adapters
    if (
      message.includes("DialogContent` requires a `DialogTitle`") &&
      message.includes("@solana/wallet-adapter")
    ) {
      return; // Suppress this specific warning from wallet adapters
    }

    // Let all other warnings through
    originalWarn.apply(console, args);
  };
};

// Call this when the app initializes
if (typeof window !== "undefined") {
  configureAccessibility();
}
