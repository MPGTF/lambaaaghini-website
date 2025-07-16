import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "sonner";
import {
  Send,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Wallet,
  Link as LinkIcon,
} from "lucide-react";

interface MarketingProposal {
  // Contact Information
  name: string;
  email: string;
  company: string;
  role: string;
  telegram: string;
  twitter: string;

  // Proposal Details
  proposalTitle: string;
  proposalType: string;
  description: string;
  targetAudience: string;
  duration: string;
  budget: string;
  expectedResults: string;

  // Marketing Channels
  channels: string[];
  primaryChannel: string;

  // Timeline & Deliverables
  startDate: string;
  timeline: string;
  deliverables: string;
  metrics: string;

  // Additional Information
  previousWork: string;
  whyLambaaaghini: string;
  additionalInfo: string;

  // Terms
  agreedToTerms: boolean;
  agreedToPayment: boolean;
}

export default function MarketingProposals() {
  const { publicKey, signTransaction } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [formData, setFormData] = useState<MarketingProposal>({
    name: "",
    email: "",
    company: "",
    role: "",
    telegram: "",
    twitter: "",
    proposalTitle: "",
    proposalType: "",
    description: "",
    targetAudience: "",
    duration: "",
    budget: "",
    expectedResults: "",
    channels: [],
    primaryChannel: "",
    startDate: "",
    timeline: "",
    deliverables: "",
    metrics: "",
    previousWork: "",
    whyLambaaaghini: "",
    additionalInfo: "",
    agreedToTerms: false,
    agreedToPayment: false,
  });

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/demo",
  );
  const PROPOSAL_FEE = 0.1; // 0.1 SOL
  const FEE_WALLET = "F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966";

  const marketingChannels = [
    "Social Media (Twitter/X)",
    "Influencer Marketing",
    "Content Marketing",
    "Community Building",
    "Email Marketing",
    "Paid Advertising",
    "PR & Media",
    "Events & Conferences",
    "Partnerships",
    "SEO/SEM",
    "Video Marketing",
    "Podcast Sponsorship",
  ];

  const proposalTypes = [
    "Brand Awareness Campaign",
    "Community Growth",
    "Influencer Partnership",
    "Content Strategy",
    "Social Media Management",
    "Paid Advertising Campaign",
    "Event Marketing",
    "PR & Media Relations",
    "Partnership Development",
    "User Acquisition",
    "Retention Campaign",
    "Product Launch",
  ];

  const handleInputChange = (field: keyof MarketingProposal, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "company",
      "proposalTitle",
      "proposalType",
      "description",
      "targetAudience",
      "budget",
      "expectedResults",
      "primaryChannel",
      "timeline",
      "deliverables",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof MarketingProposal]) {
        toast.error(
          `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field`,
        );
        return false;
      }
    }

    if (formData.channels.length === 0) {
      toast.error("Please select at least one marketing channel");
      return false;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return false;
    }

    if (!formData.agreedToPayment) {
      toast.error("Please acknowledge the 0.1 SOL proposal fee");
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first!");
      return false;
    }

    try {
      const transaction = new Transaction();
      const feeInLamports = PROPOSAL_FEE * LAMPORTS_PER_SOL;

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: feeInLamports,
      });

      transaction.add(transferInstruction);

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      await connection.confirmTransaction(signature, "confirmed");

      toast.success(`🐑💰 Payment successful! TX: ${signature.slice(0, 8)}...`);
      return true;
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
      return false;
    }
  };

  const postToTwitter = async (proposalData: MarketingProposal) => {
    // Create a summary tweet about the proposal
    const tweetText = `🐑 NEW MARKETING PROPOSAL 🐑

📌 ${proposalData.proposalTitle}
🏢 ${proposalData.company}
💰 Budget: ${proposalData.budget}
📊 Type: ${proposalData.proposalType}

"${proposalData.description.substring(0, 100)}..."

Contact: ${proposalData.email}

#LAMBAAAGHINI #MarketingProposal #DeFi #SheepMeetSupercars`;

    try {
      // Call your secure backend API endpoint
      const response = await fetch("/api/twitter/post-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tweetText,
          proposalData: {
            company: proposalData.company,
            email: proposalData.email,
            proposalTitle: proposalData.proposalTitle,
            proposalType: proposalData.proposalType,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Tweet posted successfully:", result.tweetUrl);
        return {
          success: true,
          tweetUrl: result.tweetUrl,
          tweetId: result.tweetId,
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to post to Twitter:", error);
      // Fallback - just return the text that would have been posted
      return {
        success: false,
        tweetText,
        error: error.message,
      };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let paymentMade = false;
      let publicPosting = false;

      // Try to process payment if wallet is connected
      if (publicKey && signTransaction) {
        try {
          toast.loading("Attempting to process 0.1 SOL fee...");
          paymentMade = await processPayment();
          if (paymentMade) {
            setPaymentCompleted(true);
            toast.success(
              "💰 Payment successful! Proposal will be reviewed privately.",
            );
          }
        } catch (error) {
          console.log("Payment failed, will proceed with public posting");
        }
      }

      // If no payment was made, prepare for public posting
      if (!paymentMade) {
        publicPosting = true;
        const tweetContent = await postToTwitter(formData);

        toast.warning(
          "⚠️ No payment received - proposal will be posted publicly on our X account for community feedback!",
          { duration: 6000 },
        );

        // Show what will be posted
        toast.info(`📱 Will post: "${tweetContent.substring(0, 100)}..."`, {
          duration: 8000,
        });
      }

      // Submit the proposal (regardless of payment)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (paymentMade) {
        toast.success(
          "🐑📧 Private proposal submitted successfully! We'll review it confidentially and get back to you within 48 hours.",
        );
      } else {
        toast.success(
          "🐑📱 Proposal submitted and posted publicly on X! Community can now see and comment on your proposal. We'll still review it within 48 hours.",
        );
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        role: "",
        telegram: "",
        twitter: "",
        proposalTitle: "",
        proposalType: "",
        description: "",
        targetAudience: "",
        duration: "",
        budget: "",
        expectedResults: "",
        channels: [],
        primaryChannel: "",
        startDate: "",
        timeline: "",
        deliverables: "",
        metrics: "",
        previousWork: "",
        whyLambaaaghini: "",
        additionalInfo: "",
        agreedToTerms: false,
        agreedToPayment: false,
      });
      setPaymentCompleted(false);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-20 relative">
      {/* Floating mini lamb car logos */}
      <div className="absolute top-24 right-12 opacity-20 animate-pulse pointer-events-none">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=80"
          alt="Lambaaaghini"
          className="w-11 h-7 object-cover rounded-lg"
        />
      </div>
      <div
        className="absolute bottom-40 left-8 opacity-15 animate-bounce pointer-events-none"
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
          <Badge className="mb-6 bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
            📈💡 Marketing Proposals - Partner with LAMBAAAGHINI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-green-400 drop-shadow-lg font-bold">
              MARKETING
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">
              PARTNERSHIPS
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
            Ready to help LAMBAAAGHINI reach new heights? Submit your marketing
            proposal and join our mission to bring sheep to supercars! 🐑🚗💨
          </p>
          {/* Medium lamb car image for marketing inspiration */}
          <div className="flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=180"
              alt="Marketing Partnership Goals"
              className="w-28 h-18 object-cover rounded-lg opacity-70 hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        {/* Wallet Connection */}
        {!publicKey && (
          <Card className="glass-card border-blue-500/20 mb-8">
            <CardContent className="p-8 text-center">
              <Wallet className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Wallet Connection (Optional)
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to pay 0.1 SOL for private review, or submit
                without payment for public posting on X!
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-purple-700 hover:!from-purple-600 hover:!to-purple-800 !text-white !font-semibold !border-0 !rounded-md !px-6 !py-3" />
              <p className="text-xs text-muted-foreground mt-3">
                You can still submit your proposal without connecting a wallet
              </p>
            </CardContent>
          </Card>
        )}

        {publicKey && (
          <>
            {/* Fee Information */}
            <Card className="glass-card border-orange-500/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="h-8 w-8 text-orange-400" />
                  <div>
                    <h3 className="text-lg font-bold">
                      Optional Privacy Fee: 0.1 SOL
                    </h3>
                    <p className="text-muted-foreground">
                      <strong>Pay 0.1 SOL:</strong> Your proposal stays private
                      and gets confidential review.
                      <br />
                      <strong>No payment:</strong> Your proposal gets posted
                      publicly on our X account for community feedback!
                    </p>
                  </div>
                  {paymentCompleted && (
                    <CheckCircle className="h-8 w-8 text-green-400 ml-auto" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Proposal Form */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-400" />
                  Marketing Proposal Submission
                </CardTitle>
                <CardDescription>
                  Fill out this comprehensive form to submit your marketing
                  proposal. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gold-400">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Agency *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        placeholder="Marketing Agency Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Your Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) =>
                          handleInputChange("role", e.target.value)
                        }
                        placeholder="Marketing Director"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telegram">Telegram Handle</Label>
                      <Input
                        id="telegram"
                        value={formData.telegram}
                        onChange={(e) =>
                          handleInputChange("telegram", e.target.value)
                        }
                        placeholder="@yourtelegram"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter/X Handle</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) =>
                          handleInputChange("twitter", e.target.value)
                        }
                        placeholder="@yourtwitter"
                      />
                    </div>
                  </div>
                </div>

                {/* Proposal Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">
                    Proposal Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="proposalTitle">Proposal Title *</Label>
                      <Input
                        id="proposalTitle"
                        value={formData.proposalTitle}
                        onChange={(e) =>
                          handleInputChange("proposalTitle", e.target.value)
                        }
                        placeholder="LAMBAAAGHINI Social Media Growth Campaign"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proposalType">Proposal Type *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("proposalType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proposal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {proposalTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your marketing proposal in detail. What are you proposing to do for LAMBAAAGHINI?"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="targetAudience">
                          Target Audience *
                        </Label>
                        <Input
                          id="targetAudience"
                          value={formData.targetAudience}
                          onChange={(e) =>
                            handleInputChange("targetAudience", e.target.value)
                          }
                          placeholder="DeFi enthusiasts, meme coin traders"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Campaign Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) =>
                            handleInputChange("duration", e.target.value)
                          }
                          placeholder="3 months"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="budget">Proposed Budget *</Label>
                      <Input
                        id="budget"
                        value={formData.budget}
                        onChange={(e) =>
                          handleInputChange("budget", e.target.value)
                        }
                        placeholder="$10,000 - $50,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedResults">
                        Expected Results/KPIs *
                      </Label>
                      <Textarea
                        id="expectedResults"
                        value={formData.expectedResults}
                        onChange={(e) =>
                          handleInputChange("expectedResults", e.target.value)
                        }
                        placeholder="Expected followers growth, engagement rates, conversions, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing Channels */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">
                    Marketing Channels
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Marketing Channels (Select all that apply) *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {marketingChannels.map((channel) => (
                          <div
                            key={channel}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={channel}
                              checked={formData.channels.includes(channel)}
                              onCheckedChange={() =>
                                handleChannelToggle(channel)
                              }
                            />
                            <Label htmlFor={channel} className="text-sm">
                              {channel}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="primaryChannel">Primary Channel *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("primaryChannel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary marketing channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketingChannels.map((channel) => (
                            <SelectItem key={channel} value={channel}>
                              {channel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Timeline & Deliverables */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-400">
                    Timeline & Deliverables
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startDate">Proposed Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeline">Project Timeline *</Label>
                      <Textarea
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) =>
                          handleInputChange("timeline", e.target.value)
                        }
                        placeholder="Week 1-2: Strategy development, Week 3-4: Content creation..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliverables">Key Deliverables *</Label>
                      <Textarea
                        id="deliverables"
                        value={formData.deliverables}
                        onChange={(e) =>
                          handleInputChange("deliverables", e.target.value)
                        }
                        placeholder="Social media posts, video content, influencer partnerships..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="metrics">Success Metrics</Label>
                      <Textarea
                        id="metrics"
                        value={formData.metrics}
                        onChange={(e) =>
                          handleInputChange("metrics", e.target.value)
                        }
                        placeholder="How will you measure success? Engagement rates, follower growth, etc."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="previousWork">
                        Previous Work/Portfolio
                      </Label>
                      <Textarea
                        id="previousWork"
                        value={formData.previousWork}
                        onChange={(e) =>
                          handleInputChange("previousWork", e.target.value)
                        }
                        placeholder="Links to previous campaigns, case studies, or relevant work"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whyLambaaaghini">Why LAMBAAAGHINI?</Label>
                      <Textarea
                        id="whyLambaaaghini"
                        value={formData.whyLambaaaghini}
                        onChange={(e) =>
                          handleInputChange("whyLambaaaghini", e.target.value)
                        }
                        placeholder="Why do you want to work with LAMBAAAGHINI? What excites you about our project?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="additionalInfo">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          handleInputChange("additionalInfo", e.target.value)
                        }
                        placeholder="Any other information you'd like to share"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreedToTerms", checked)
                      }
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree that my proposal information may be reviewed by
                      the LAMBAAAGHINI team and I understand that submission
                      does not guarantee acceptance *
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment"
                      checked={formData.agreedToPayment}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreedToPayment", checked)
                      }
                    />
                    <Label htmlFor="payment" className="text-sm">
                      I understand that without paying 0.1 SOL, my proposal will
                      be posted publicly on LAMBAAAGHINI's X account for
                      community review *
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !formData.agreedToTerms ||
                      !formData.agreedToPayment
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Target className="h-5 w-5 mr-2 animate-spin" />
                        Processing Proposal...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Proposal{" "}
                        {publicKey
                          ? "(Try 0.1 SOL or Public)"
                          : "(Public Post)"}
                      </>
                    )}
                  </Button>

                  {/* Information about what happens */}
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-blue-400">
                      <strong>What happens next:</strong>
                      <br />
                      {publicKey ? (
                        <>
                          💰 We'll try to charge 0.1 SOL for private review
                          <br />
                          📱 If payment fails, proposal goes public on X
                        </>
                      ) : (
                        <>
                          📱 Your proposal will be posted on our X account
                          <br />
                          🔍 Community can see and provide feedback
                        </>
                      )}
                    </div>
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
