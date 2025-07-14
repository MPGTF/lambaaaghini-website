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
  Heart,
  Sheep,
} from "lucide-react";

interface SheepDroppingAccount {
  address: string;
  balance: number;
  type: "sol" | "token";
  mint?: string;
  symbol?: string;
}

export default function LambPooperScooper() {
  const { publicKey, signTransaction } = useWallet();
  const [isSniffing, setIsSniffing] = useState(false);
  const [isScooping, setIsScooping] = useState(false);
  const [sheepDroppings, setSheepDroppings] = useState<SheepDroppingAccount[]>(
    [],
  );
  const [sniffProgress, setSniffProgress] = useState(0);
  const [totalPoopValue, setTotalPoopValue] = useState(0);
  const [selectedDroppings, setSelectedDroppings] = useState<string[]>([]);
  const [estimatedTreat, setEstimatedTreat] = useState(0);

  // Our treat collection wallet (shepherd's fee)
  const SHEPHERD_WALLET = "F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966";
  const SHEPHERD_FEE = 0.05; // 5% shepherd's fee for cleaning up after the lambs
  const POOP_THRESHOLD = 0.001; // Consider anything under 0.001 SOL as sheep droppings

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/demo",
  );

  useEffect(() => {
    if (sheepDroppings.length > 0) {
      const selected = sheepDroppings.filter((dropping) =>
        selectedDroppings.includes(dropping.address),
      );
      const total = selected.reduce(
        (sum, dropping) => sum + dropping.balance,
        0,
      );
      setTotalPoopValue(total);
      setEstimatedTreat(total * SHEPHERD_FEE);
    }
  }, [selectedDroppings, sheepDroppings]);

  const sniffForDroppings = async () => {
    if (!publicKey) {
      toast.error("🐑 Connect your wallet first, little lamb!");
      return;
    }

    setIsSniffing(true);
    setSniffProgress(0);
    setSheepDroppings([]);

    try {
      const droppingsFound: SheepDroppingAccount[] = [];

      // Check main SOL balance for small amounts (sheep crumbs)
      setSniffProgress(20);
      const solBalance = await connection.getBalance(publicKey);
      const solInSOL = solBalance / LAMPORTS_PER_SOL;

      if (solInSOL > 0 && solInSOL < POOP_THRESHOLD) {
        droppingsFound.push({
          address: publicKey.toBase58(),
          balance: solInSOL,
          type: "sol",
          symbol: "SOL Crumbs",
        });
      }

      // Check token accounts for empty pastures (abandoned token accounts)
      setSniffProgress(40);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
      );

      setSniffProgress(60);

      for (let i = 0; i < tokenAccounts.value.length; i++) {
        const tokenAccount = tokenAccounts.value[i];
        const accountData = tokenAccount.account.data.parsed.info;
        const balance = parseFloat(accountData.tokenAmount.uiAmount || "0");

        // Find empty pastures (0 balance but still holding rent like sheep poop)
        if (balance === 0) {
          try {
            // Get the actual account info to check rent amount
            const accountInfo = await connection.getAccountInfo(
              tokenAccount.pubkey,
            );

            if (accountInfo && accountInfo.lamports > 0) {
              // Standard token account rent is ~0.00203928 SOL
              const rentInSOL = accountInfo.lamports / LAMPORTS_PER_SOL;

              // Only include accounts with meaningful rent (filter out dust)
              if (rentInSOL >= 0.002) {
                // Get token mint info for better display
                let tokenSymbol = "Unknown Token";
                try {
                  const mintInfo = await connection.getParsedAccountInfo(
                    new PublicKey(accountData.mint),
                  );
                  if (mintInfo.value?.data && "parsed" in mintInfo.value.data) {
                    const mintData = mintInfo.value.data.parsed.info;
                    if (mintData.symbol) {
                      tokenSymbol = mintData.symbol;
                    }
                  }
                } catch (e) {
                  // Use fallback naming
                  tokenSymbol = `Token (${accountData.mint.slice(0, 8)}...)`;
                }

                droppingsFound.push({
                  address: tokenAccount.pubkey.toBase58(),
                  balance: rentInSOL,
                  type: "token",
                  mint: accountData.mint,
                  symbol: `Empty ${tokenSymbol} Account`,
                });
              }
            }
          } catch (error) {
            console.log(
              `Error checking account ${tokenAccount.pubkey.toBase58()}:`,
              error,
            );
          }
        }

        setSniffProgress(60 + (40 * (i + 1)) / tokenAccounts.value.length);
      }

      setSheepDroppings(droppingsFound);

      // Auto-select all droppings for scooping
      setSelectedDroppings(droppingsFound.map((dropping) => dropping.address));

      setSniffProgress(100);

      if (droppingsFound.length === 0) {
        toast.success(
          "🐑✨ Your pasture is squeaky clean! No sheep droppings found!",
        );
      } else {
        toast.success(
          `🐑💩 Found ${droppingsFound.length} sheep droppings to scoop up!`,
        );
      }
    } catch (error) {
      console.error("Sniffing failed:", error);
      toast.error(
        "🐑❌ Failed to sniff for droppings. The sheep are being shy!",
      );
    } finally {
      setIsSniffing(false);
    }
  };

  const scoopDroppings = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("🐑 Connect your wallet first, shepherd!");
      return;
    }

    if (selectedDroppings.length === 0) {
      toast.error("🐑 Select some droppings to scoop first!");
      return;
    }

    setIsScooping(true);

    try {
      // First transaction: Close empty token accounts to reclaim rent
      const closeTransaction = new Transaction();
      let closeInstructions: TransactionInstruction[] = [];

      const selectedPoop = sheepDroppings.filter((dropping) =>
        selectedDroppings.includes(dropping.address),
      );

      let actualRentReclaimed = 0;
      let closedAccounts = 0;

      // Close empty token accounts to reclaim their rent
      for (const dropping of selectedPoop) {
        if (dropping.type === "token") {
          try {
            // Verify the account exists and has 0 token balance
            const accountInfo = await connection.getAccountInfo(
              new PublicKey(dropping.address),
            );

            if (accountInfo) {
              const tokenAccountData = await connection.getParsedAccountInfo(
                new PublicKey(dropping.address),
              );

              const parsedData = tokenAccountData.value?.data;
              if (parsedData && "parsed" in parsedData) {
                const tokenBalance =
                  parsedData.parsed.info.tokenAmount.uiAmount;

                // Only close accounts with 0 balance
                if (tokenBalance === 0) {
                  const closeInstruction = createCloseAccountInstruction(
                    new PublicKey(dropping.address),
                    publicKey, // destination for rent
                    publicKey, // authority
                  );
                  closeInstructions.push(closeInstruction);
                  actualRentReclaimed +=
                    accountInfo.lamports / LAMPORTS_PER_SOL;
                  closedAccounts++;
                }
              }
            }
          } catch (error) {
            console.log(`Skipping account ${dropping.address}:`, error);
          }
        }
      }

      if (closeInstructions.length === 0) {
        toast.error("🐑 No valid empty token accounts found to close!");
        setIsScooping(false);
        return;
      }

      closeTransaction.add(...closeInstructions);

      // Get recent blockhash for close transaction
      const { blockhash: closeBlockhash } =
        await connection.getLatestBlockhash();
      closeTransaction.recentBlockhash = closeBlockhash;
      closeTransaction.feePayer = publicKey;

      // Sign and send close transaction
      toast.loading("🐑 Closing empty token accounts...");
      const signedCloseTransaction = await signTransaction(closeTransaction);
      const closeSignature = await connection.sendRawTransaction(
        signedCloseTransaction.serialize(),
      );

      // Wait for close transaction to confirm
      await connection.confirmTransaction(closeSignature, "confirmed");

      // Calculate actual fee based on rent reclaimed
      const actualFee = actualRentReclaimed * SHEPHERD_FEE;
      const userReceives = actualRentReclaimed - actualFee;

      // Second transaction: Pay shepherd's fee if there's significant rent reclaimed
      if (actualFee > 0.001) {
        // Only charge fee if meaningful amount
        const feeTransaction = new Transaction();
        const feeInLamports = Math.floor(actualFee * LAMPORTS_PER_SOL);

        const feeInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(SHEPHERD_WALLET),
          lamports: feeInLamports,
        });

        feeTransaction.add(feeInstruction);

        const { blockhash: feeBlockhash } =
          await connection.getLatestBlockhash();
        feeTransaction.recentBlockhash = feeBlockhash;
        feeTransaction.feePayer = publicKey;

        toast.loading("🐑 Paying shepherd's fee...");
        const signedFeeTransaction = await signTransaction(feeTransaction);
        const feeSignature = await connection.sendRawTransaction(
          signedFeeTransaction.serialize(),
        );

        await connection.confirmTransaction(feeSignature, "confirmed");
      }

      toast.success(
        `🐑🧹✨ Pasture cleaned! Reclaimed ${actualRentReclaimed.toFixed(6)} SOL from ${closedAccounts} empty accounts. You received ${userReceives.toFixed(6)} SOL after shepherd's fee!`,
      );

      // Refresh the sniffing after cleanup
      setTimeout(() => {
        sniffForDroppings();
      }, 3000);
    } catch (error) {
      console.error("Scooping failed:", error);
      toast.error("🐑💩 Failed to scoop droppings. The sheep scattered!");
    } finally {
      setIsScooping(false);
    }
  };

  const toggleDroppingSelection = (address: string) => {
    setSelectedDroppings((prev) =>
      prev.includes(address)
        ? prev.filter((addr) => addr !== address)
        : [...prev, address],
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 relative">
      {/* Floating mini lamb car logos */}
      <div className="absolute top-24 right-16 opacity-25 animate-pulse pointer-events-none">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
          alt="Lambaaaghini"
          className="w-11 h-7 object-cover rounded-lg"
        />
      </div>
      <div
        className="absolute top-1/3 left-8 opacity-20 animate-bounce pointer-events-none"
        style={{ animationDelay: "1.5s" }}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
          alt="Lambaaaghini"
          className="w-9 h-6 object-cover rounded-lg"
        />
      </div>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-full flex items-center justify-center relative">
              <span className="text-4xl">🐑</span>
              <div className="absolute -bottom-1 -right-1 text-lg">💩</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gold-400">Lamb</span>{" "}
            <span className="text-purple-400">Pooper Scooper</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Clean up after your crypto sheep! Scoop up SOL droppings from
            abandoned token pastures. Your shepherd takes a small 5% treat fee
            for the cleanup service. 🐑💩➡️💰
          </p>
          {/* Medium lamb car image representing the goal of cleaning */}
          <div className="flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=170"
              alt="Clean for the Lambaaaghini"
              className="w-26 h-16 object-cover rounded-lg opacity-75 hover:opacity-95 transition-opacity"
            />
          </div>
        </div>

        {/* Wallet Connection */}
        {!publicKey && (
          <Card className="glass-card border-purple-500/20 mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🐑</div>
              <h3 className="text-2xl font-bold mb-4">
                Connect Your Sheep Wallet
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to start sniffing for sheep droppings in
                your pasture
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-6 !py-3" />
            </CardContent>
          </Card>
        )}

        {publicKey && (
          <>
            {/* Sniff Section */}
            <Card className="glass-card border-gold-500/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👃</span>
                  Sheep Dropping Sniffer
                </CardTitle>
                <CardDescription>
                  Sniff around your wallet pasture for reclaimable SOL droppings
                  and abandoned token accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isSniffing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>🐑 Sniffing around the pasture...</span>
                        <span>{Math.round(sniffProgress)}%</span>
                      </div>
                      <Progress value={sniffProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={sniffForDroppings}
                    disabled={isSniffing}
                    className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold"
                  >
                    {isSniffing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sniffing Pasture...
                      </>
                    ) : (
                      <>
                        <span className="text-lg mr-2">👃</span>
                        Sniff for Sheep Droppings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {sheepDroppings.length > 0 && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="glass-card border-purple-500/20">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">💩</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {sheepDroppings.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sheep Droppings Found
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-gold-500/20">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">🪙</div>
                      <div className="text-2xl font-bold text-gold-400">
                        {totalPoopValue.toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total SOL in Droppings
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-green-500/20">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">🍯</div>
                      <div className="text-2xl font-bold text-green-400">
                        {(totalPoopValue - estimatedTreat).toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        You Get (after shepherd's treat)
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Droppings List */}
                <Card className="glass-card border-border/50 mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">💩</span>
                        Sheep Droppings ({sheepDroppings.length})
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedDroppings(
                            selectedDroppings.length === sheepDroppings.length
                              ? []
                              : sheepDroppings.map(
                                  (dropping) => dropping.address,
                                ),
                          )
                        }
                      >
                        {selectedDroppings.length === sheepDroppings.length
                          ? "🚫 Deselect All"
                          : "✅ Select All"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sheepDroppings.map((dropping, index) => (
                        <div
                          key={dropping.address}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedDroppings.includes(dropping.address)
                              ? "border-gold-500/50 bg-gold-500/10"
                              : "border-border/30 hover:border-border/50"
                          }`}
                          onClick={() =>
                            toggleDroppingSelection(dropping.address)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-4 h-4 rounded border-2 ${
                                  selectedDroppings.includes(dropping.address)
                                    ? "bg-gold-400 border-gold-400"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {selectedDroppings.includes(
                                  dropping.address,
                                ) && (
                                  <CheckCircle className="h-3 w-3 text-black" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <span className="text-lg">
                                    {dropping.type === "sol" ? "🍃" : "🏚️"}
                                  </span>
                                  {dropping.symbol ||
                                    dropping.address.slice(0, 8) + "..."}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {dropping.type === "sol"
                                    ? "SOL Crumbs"
                                    : "Abandoned Token Pasture"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gold-400">
                                {dropping.balance.toFixed(6)} SOL
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ~${(dropping.balance * 100).toFixed(2)} USD
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Scoop Action */}
                {selectedDroppings.length > 0 && (
                  <Card className="glass-card border-green-500/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Alert>
                          <Heart className="h-4 w-4" />
                          <AlertDescription>
                            <strong>🐑 Shepherd's Fee:</strong> We charge a 5%
                            treat fee for cleaning up after your sheep. You'll
                            receive{" "}
                            {(totalPoopValue - estimatedTreat).toFixed(6)} SOL
                            after we get our well-deserved treats! 🍯
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>💩 Total Droppings:</span>
                            <span className="font-semibold">
                              {totalPoopValue.toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>🍯 Shepherd's Treats (5%):</span>
                            <span className="font-semibold text-orange-400">
                              -{estimatedTreat.toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-green-400">
                            <span>🐑 You Keep:</span>
                            <span>
                              {(totalPoopValue - estimatedTreat).toFixed(6)} SOL
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>🏚️ Pastures to Clean:</span>
                            <span className="font-semibold">
                              {selectedDroppings.length}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={scoopDroppings}
                          disabled={
                            isScooping || selectedDroppings.length === 0
                          }
                          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-6 text-lg"
                        >
                          {isScooping ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              🐑 Scooping Droppings...
                            </>
                          ) : (
                            <>
                              <span className="text-xl mr-2">🧹</span>
                              Scoop {selectedDroppings.length} Dropping
                              {selectedDroppings.length !== 1 ? "s" : ""} (
                              {(totalPoopValue - estimatedTreat).toFixed(4)}{" "}
                              SOL)
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">🐑</span>
                  How Sheep Pooper Scooping Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👃</span>
                    </div>
                    <h3 className="font-semibold mb-2">1. Sniff Around</h3>
                    <p className="text-muted-foreground">
                      We sniff your wallet pasture for abandoned token accounts
                      and SOL crumbs left behind by your sheep
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🧹</span>
                    </div>
                    <h3 className="font-semibold mb-2">2. Scoop the Poop</h3>
                    <p className="text-muted-foreground">
                      Empty token pastures are cleaned up, returning their rent
                      (≈0.002 SOL each) back to your wallet
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🍯</span>
                    </div>
                    <h3 className="font-semibold mb-2">3. Share Treats</h3>
                    <p className="text-muted-foreground">
                      You get your clean SOL back and we get 5% treats for being
                      good shepherds and cleaning up!
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
