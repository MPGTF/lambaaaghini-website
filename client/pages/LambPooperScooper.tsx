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

  const connection = new Connection("https://api.mainnet-beta.solana.com");

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
          // These accounts hold rent (~0.00203928 SOL) that can be scooped up
          const accountInfo = await connection.getAccountInfo(
            tokenAccount.pubkey,
          );
          if (accountInfo) {
            const rentInSOL = accountInfo.lamports / LAMPORTS_PER_SOL;
            droppingsFound.push({
              address: tokenAccount.pubkey.toBase58(),
              balance: rentInSOL,
              type: "token",
              mint: accountData.mint,
              symbol: `Abandoned Pasture (${accountData.mint.slice(0, 8)}...)`,
            });
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
      const transaction = new Transaction();
      const instructions: TransactionInstruction[] = [];

      const selectedPoop = sheepDroppings.filter((dropping) =>
        selectedDroppings.includes(dropping.address),
      );

      // Close empty pastures to reclaim their rent (scoop the poop!)
      for (const dropping of selectedPoop) {
        if (dropping.type === "token") {
          const closeInstruction = createCloseAccountInstruction(
            new PublicKey(dropping.address),
            publicKey, // destination for rent (back to the shepherd)
            publicKey, // authority
          );
          instructions.push(closeInstruction);
        }
      }

      // Pay the shepherd's fee for the cleanup service
      if (estimatedTreat > 0) {
        const treatInLamports = Math.floor(estimatedTreat * LAMPORTS_PER_SOL);
        const treatInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(SHEPHERD_WALLET),
          lamports: treatInLamports,
        });
        instructions.push(treatInstruction);
      }

      if (instructions.length === 0) {
        toast.error("🐑 No valid droppings to scoop!");
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

      const reclaimedAmount = totalPoopValue - estimatedTreat;

      toast.success(
        `🐑🧹✨ Pasture cleaned! Scooped up ${reclaimedAmount.toFixed(6)} SOL worth of sheep droppings! (${instructions.length - 1} empty pastures cleaned)`,
      );

      // Refresh the sniffing after cleanup
      setTimeout(() => {
        sniffForDroppings();
      }, 2000);
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
    <div className="min-h-screen bg-background p-6">
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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Clean up after your crypto sheep! Scoop up SOL droppings from
            abandoned token pastures. Your shepherd takes a small 5% treat fee
            for the cleanup service. 🐑💩➡️💰
          </p>
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
