import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createCloseAccountInstruction,
  getMint,
} from "@solana/spl-token";
import { toast } from "sonner";
import {
  Vacuum,
  Wallet,
  Coins,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Trash2,
  DollarSign,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface DustAccount {
  address: string;
  balance: number;
  type: "sol" | "token";
  mint?: string;
  symbol?: string;
}

export default function SolDustCleaner() {
  const { publicKey, signTransaction } = useWallet();
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [dustAccounts, setDustAccounts] = useState<DustAccount[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [totalDustValue, setTotalDustValue] = useState(0);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [estimatedFee, setEstimatedFee] = useState(0);

  // Our fee wallet address
  const FEE_WALLET = "F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966";
  const FEE_PERCENTAGE = 0.05; // 5% fee
  const DUST_THRESHOLD = 0.001; // Consider anything under 0.001 SOL as dust

  const connection = new Connection("https://api.mainnet-beta.solana.com");

  useEffect(() => {
    if (dustAccounts.length > 0) {
      const selected = dustAccounts.filter((account) =>
        selectedAccounts.includes(account.address),
      );
      const total = selected.reduce((sum, account) => sum + account.balance, 0);
      setTotalDustValue(total);
      setEstimatedFee(total * FEE_PERCENTAGE);
    }
  }, [selectedAccounts, dustAccounts]);

  const scanForDust = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setDustAccounts([]);

    try {
      const dustFound: DustAccount[] = [];

      // Check main SOL balance
      setScanProgress(20);
      const solBalance = await connection.getBalance(publicKey);
      const solInSOL = solBalance / LAMPORTS_PER_SOL;

      if (solInSOL > 0 && solInSOL < DUST_THRESHOLD) {
        dustFound.push({
          address: publicKey.toBase58(),
          balance: solInSOL,
          type: "sol",
          symbol: "SOL",
        });
      }

      // Check token accounts for empty/dust accounts
      setScanProgress(40);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
      );

      setScanProgress(60);

      for (let i = 0; i < tokenAccounts.value.length; i++) {
        const tokenAccount = tokenAccounts.value[i];
        const accountData = tokenAccount.account.data.parsed.info;
        const balance = parseFloat(accountData.tokenAmount.uiAmount || "0");

        // Find empty token accounts (0 balance but still open)
        if (balance === 0) {
          // These accounts hold rent (~0.00203928 SOL) that can be reclaimed
          const accountInfo = await connection.getAccountInfo(
            tokenAccount.pubkey,
          );
          if (accountInfo) {
            const rentInSOL = accountInfo.lamports / LAMPORTS_PER_SOL;
            dustFound.push({
              address: tokenAccount.pubkey.toBase58(),
              balance: rentInSOL,
              type: "token",
              mint: accountData.mint,
              symbol: `Token Account (${accountData.mint.slice(0, 8)}...)`,
            });
          }
        }

        setScanProgress(60 + (40 * (i + 1)) / tokenAccounts.value.length);
      }

      setDustAccounts(dustFound);

      // Auto-select all accounts
      setSelectedAccounts(dustFound.map((account) => account.address));

      setScanProgress(100);

      if (dustFound.length === 0) {
        toast.success("🐑 Your wallet is squeaky clean! No dust found!");
      } else {
        toast.success(`🧹 Found ${dustFound.length} dust sources to clean!`);
      }
    } catch (error) {
      console.error("Scan failed:", error);
      toast.error("Failed to scan for dust. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const cleanDust = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (selectedAccounts.length === 0) {
      toast.error("Please select accounts to clean!");
      return;
    }

    setIsCleaning(true);

    try {
      const transaction = new Transaction();
      const instructions: TransactionInstruction[] = [];

      const selectedDust = dustAccounts.filter((account) =>
        selectedAccounts.includes(account.address),
      );

      // Close empty token accounts to reclaim rent
      for (const dustAccount of selectedDust) {
        if (dustAccount.type === "token") {
          const closeInstruction = createCloseAccountInstruction(
            new PublicKey(dustAccount.address),
            publicKey, // destination for rent
            publicKey, // authority
          );
          instructions.push(closeInstruction);
        }
      }

      // Add fee payment instruction
      if (estimatedFee > 0) {
        const feeInLamports = Math.floor(estimatedFee * LAMPORTS_PER_SOL);
        const feeInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(FEE_WALLET),
          lamports: feeInLamports,
        });
        instructions.push(feeInstruction);
      }

      if (instructions.length === 0) {
        toast.error("No valid accounts to clean!");
        return;
      }

      transaction.add(...instructions);

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      await connection.confirmTransaction(signature);

      const reclaimedAmount = totalDustValue - estimatedFee;

      toast.success(
        `🧹✨ Dust cleaned! Reclaimed ${reclaimedAmount.toFixed(6)} SOL (${instructions.length - 1} accounts closed)`,
      );

      // Refresh the scan
      setTimeout(() => {
        scanForDust();
      }, 2000);
    } catch (error) {
      console.error("Cleaning failed:", error);
      toast.error("Failed to clean dust. Please try again.");
    } finally {
      setIsCleaning(false);
    }
  };

  const toggleAccountSelection = (address: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(address)
        ? prev.filter((addr) => addr !== address)
        : [...prev, address],
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <Vacuum className="h-8 w-8 text-gold-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gold-400">SOL</span>{" "}
            <span className="text-purple-400">Dust Cleaner</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reclaim your SOL dust from empty token accounts and tiny balances.
            We'll clean your wallet for a small 5% fee. 🐑🧹
          </p>
        </div>

        {/* Wallet Connection */}
        {!publicKey && (
          <Card className="glass-card border-purple-500/20 mb-8">
            <CardContent className="p-8 text-center">
              <Wallet className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to start scanning for SOL dust
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-6 !py-3" />
            </CardContent>
          </Card>
        )}

        {publicKey && (
          <>
            {/* Scan Section */}
            <Card className="glass-card border-gold-500/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-400" />
                  Dust Scanner
                </CardTitle>
                <CardDescription>
                  Scan your wallet for reclaimable SOL dust and empty token
                  accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Scanning wallet...</span>
                        <span>{Math.round(scanProgress)}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={scanForDust}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning Wallet...
                      </>
                    ) : (
                      <>
                        <Vacuum className="h-4 w-4 mr-2" />
                        Scan for Dust
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {dustAccounts.length > 0 && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="glass-card border-purple-500/20">
                    <CardContent className="p-6 text-center">
                      <Coins className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">
                        {dustAccounts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Dust Sources Found
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-gold-500/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gold-400">
                        {totalDustValue.toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total SOL Reclaimable
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-green-500/20">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">
                        {(totalDustValue - estimatedFee).toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        You'll Receive (after 5% fee)
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Dust Accounts List */}
                <Card className="glass-card border-border/50 mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-muted-foreground" />
                        Dust Accounts ({dustAccounts.length})
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedAccounts(
                            selectedAccounts.length === dustAccounts.length
                              ? []
                              : dustAccounts.map((acc) => acc.address),
                          )
                        }
                      >
                        {selectedAccounts.length === dustAccounts.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dustAccounts.map((account, index) => (
                        <div
                          key={account.address}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedAccounts.includes(account.address)
                              ? "border-gold-500/50 bg-gold-500/10"
                              : "border-border/30 hover:border-border/50"
                          }`}
                          onClick={() =>
                            toggleAccountSelection(account.address)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-4 h-4 rounded border-2 ${
                                  selectedAccounts.includes(account.address)
                                    ? "bg-gold-400 border-gold-400"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {selectedAccounts.includes(account.address) && (
                                  <CheckCircle className="h-3 w-3 text-black" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {account.symbol ||
                                    account.address.slice(0, 8) + "..."}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {account.type === "sol"
                                    ? "SOL Balance"
                                    : "Empty Token Account"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gold-400">
                                {account.balance.toFixed(6)} SOL
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ~${(account.balance * 100).toFixed(2)} USD
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Clean Action */}
                {selectedAccounts.length > 0 && (
                  <Card className="glass-card border-green-500/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Fee Structure:</strong> We charge a 5% fee
                            on the total reclaimed amount. You'll receive{" "}
                            {(totalDustValue - estimatedFee).toFixed(6)} SOL
                            after fees.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Total Reclaimable:</span>
                            <span className="font-semibold">
                              {totalDustValue.toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Fee (5%):</span>
                            <span className="font-semibold text-orange-400">
                              -{estimatedFee.toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-green-400">
                            <span>You Receive:</span>
                            <span>
                              {(totalDustValue - estimatedFee).toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Accounts to Close:</span>
                            <span className="font-semibold">
                              {selectedAccounts.length}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={cleanDust}
                          disabled={isCleaning || selectedAccounts.length === 0}
                          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-6 text-lg"
                        >
                          {isCleaning ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Cleaning Dust...
                            </>
                          ) : (
                            <>
                              <Zap className="h-5 w-5 mr-2" />
                              Clean {selectedAccounts.length} Account
                              {selectedAccounts.length !== 1 ? "s" : ""}(
                              {(totalDustValue - estimatedFee).toFixed(4)} SOL)
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Info Section */}
            <Card className="glass-card border-border/30 mt-8">
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-purple-400">
                        1
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">Scan Wallet</h3>
                    <p className="text-muted-foreground">
                      We scan for empty token accounts and small SOL balances
                      that can be reclaimed
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-gold-400">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Close Accounts</h3>
                    <p className="text-muted-foreground">
                      Empty token accounts are closed, returning their rent
                      (≈0.002 SOL each) to you
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-green-400">
                        3
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">Reclaim SOL</h3>
                    <p className="text-muted-foreground">
                      Receive your consolidated SOL minus our 5% service fee
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
