import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  TrendingUp,
  MessageCircle,
  Share,
  Bookmark,
  Eye,
  User,
  Search,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: "Breaking" | "Analysis" | "Sheep Culture" | "Technology" | "Comedy";
  publishedAt: Date;
  readTime: string;
  views: number;
  comments: number;
  trending: boolean;
  image: string;
}

const FAKE_NEWS: NewsArticle[] = [
  {
    id: "1",
    title:
      "Local Sheep Claims to Have Invented 'HODL' Strategy After Accidentally Sleeping on Sell Button for 3 Years",
    summary:
      "Baaaaaarbara, a 4-year-old ewe from rural Idaho, has been hailed as a crypto genius after her portfolio grew 10,000% due to what experts are calling 'the most accidentally brilliant investment strategy in DeFi history.'",
    content: `In what can only be described as the most serendipitous case of narcolepsy in financial history, a sheep named Baaaaaarbara has become an overnight sensation in the crypto community after her accidental three-year HODL strategy netted her a portfolio worth over $2.3 million.

The incident began in early 2021 when Baaaaaarbara, who had been dabbling in DeFi using a custom wool-to-keyboard interface, purchased $230 worth of various meme coins before taking what she describes as "a little nap." Unfortunately for her immediate plans but fortunately for her portfolio, the sheep fell into a deep slumber directly on top of her laptop's sell button, rendering it permanently inoperable.

"I kept dreaming about lamborghinis, but they were all made of wool," Baaaaaarbara explained through a series of sophisticated bleats translated by her financial advisor, a border collie named Warren Buffet (no relation). "When I finally woke up, I thought my computer was broken. Turns out, I was just rich."

The sheep's portfolio, which consisted primarily of DOGE, SHIB, and a mysterious token called WOOLCOIN, had grown exponentially during her extended hibernation period. Crypto analysts are calling it "the most effective diamond hands strategy ever documented" and "proof that sometimes the best trader is a sleeping trader."

Local farmers report that Baaaaaarbara has since upgraded her living situation, purchasing a golden fleece blanket and installing a hot tub in her pen. She's also reportedly working on a autobiography titled "From Baa to Billions: A Sheep's Guide to Accidental Wealth."

When asked about her future investment plans, Baaaaaarbara simply shrugged (a surprisingly expressive gesture for a sheep) and said she's considering taking another nap.`,
    author: "Cotton Woolsworth",
    category: "Breaking",
    publishedAt: new Date("2024-03-15"),
    readTime: "4 min",
    views: 25420,
    comments: 342,
    trending: true,
    image: "🐑💰",
  },
  {
    id: "2",
    title:
      "Revolutionary Study Finds That 83% of Crypto Traders Perform Better After Adopting Sheep-Like Mentality",
    summary:
      "Researchers at the prestigious Woolford University have published groundbreaking findings suggesting that traders who embrace their inner sheep actually outperform their alpha wolf counterparts by significant margins.",
    content: `A comprehensive five-year study conducted by the Behavioral Finance Department at Woolford University has revealed shocking results that are turning the traditional 'wolf of Wall Street' mentality on its head. The research, which followed 10,000 crypto traders across various skill levels, found that those who adopted what researchers term 'sheep-like trading behaviors' consistently outperformed aggressive 'wolf-pack' traders.

Dr. Mary Lambington, lead researcher and author of the study, explained: "We initially set out to prove that aggressive trading strategies yielded better results. Instead, we discovered that traders who exhibited patience, followed the herd intelligently, and avoided risky solo ventures achieved 347% better returns on average."

The study defined 'sheep-like' behaviors as: following established trading patterns, moving with market trends rather than against them, maintaining a peaceful demeanor during market volatility, and what researchers call 'collective grazing' - the practice of thoroughly researching investments as a community before making decisions.

Conversely, 'wolf-like' behaviors such as attempting to time markets perfectly, making aggressive leveraged bets, and dismissing community wisdom led to significantly higher loss rates. The research found that self-proclaimed 'alpha traders' were 73% more likely to experience complete portfolio liquidation within their first year.

"The data suggests that there's wisdom in following the flock," Dr. Lambington noted. "Sheep may be perceived as simple creatures, but they've survived for thousands of years by making smart collective decisions. Meanwhile, lone wolves often starve."

The crypto community has responded with mixed reactions. One anonymous trader commented: "I've been calling myself a sheep as an insult for years. Turns out I should have been proud!" However, some wolf-pack trading groups have dismissed the findings as "baaaad science."

The study recommends that new crypto investors consider joining sheep-like trading communities where members share research, discuss strategies collectively, and avoid the temptation to make impulsive, predatory trading decisions.`,
    author: "Dr. Fleece McWool",
    category: "Analysis",
    publishedAt: new Date("2024-03-14"),
    readTime: "6 min",
    views: 18750,
    comments: 256,
    trending: true,
    image: "📊🐑",
  },
  {
    id: "3",
    title:
      "Area Sheep Discovers DeFi, Immediately Starts Offering Financial Advice to Confused Humans",
    summary:
      "Woolbert Einstein, a 3-year-old ram from Nebraska, has launched what experts are calling 'the first sheep-to-human financial consultancy service' after achieving a 2,847% return on his DeFi investments in just six months.",
    content: `The financial world was turned upside down this week when Woolbert Einstein, a surprisingly articulate ram from a small farm in Nebraska, announced the opening of "Baa-nking on Success," the world's first sheep-operated financial advisory service for humans.

Woolbert's journey into DeFi began six months ago when he accidentally activated a farming computer while trying to scratch an itch. Instead of finding the usual corn futures data, he discovered yield farming and liquidity pools. "At first, I thought it was just another type of farming," Woolbert explained through his custom wool-to-text translator. "But then I realized these numbers were growing faster than grass in spring."

Within weeks, Woolbert had mastered concepts that confuse seasoned human traders. His strategy, which he calls "Graze and Hold," involves careful analysis of market fundamentals combined with what he describes as "instinctual flock wisdom." His portfolio, starting with just $47 (money he found in a pocket of a jacket that blew into his pen), has grown to over $1.3 million.

"Humans make trading too complicated," Woolbert observed during a recent interview conducted via video call from his upgraded smart-pen. "They let emotions like fear and greed drive their decisions. Sheep know better. We eat grass, we stay calm, we follow proven patterns. It's not rocket science."

The ram's first human client, local accountant Janet Thompson, was initially skeptical. "I mean, he's a sheep," she said. "But his advice to 'just chill and let the yields grow like grass' has netted me a 340% return in three months. I've stopped questioning it."

Woolbert's consultation fees are paid in premium hay and the occasional apple. He's currently writing a book titled "The Intelligent Sheep Investor" and plans to launch a podcast called "Wool Street Wisdom."

When asked about the secret to his success, Woolbert simply replied: "Humans overthink everything. Sometimes you just need to follow your nose to greener pastures."`,
    author: "Shearlock Holmes",
    category: "Sheep Culture",
    publishedAt: new Date("2024-03-13"),
    readTime: "5 min",
    views: 31245,
    comments: 428,
    trending: false,
    image: "🐏📈",
  },
  {
    id: "4",
    title:
      "Breaking: NFT of Sheep's First Haircut Sells for 420 ETH, Buyer Claims It 'Speaks to Their Soul'",
    summary:
      "In what art critics are calling either 'the pinnacle of digital expression' or 'absolute madness,' an NFT featuring before-and-after photos of a sheep's grooming session has broken auction records.",
    content: `The NFT marketplace was sent into a frenzy yesterday when "Fluffy's First Shear: A Journey of Transformation," a digital artwork featuring time-lapse photos of a sheep named Fluffy getting her annual haircut, sold for a record-breaking 420 ETH (approximately $847,000 at current prices).

The buyer, who goes by the pseudonym "WoolCollector.eth," defended the purchase in a lengthy Twitter thread: "This isn't just an NFT. It's a metaphor for rebirth, for shedding old layers to reveal our true selves. When I look at Fluffy's expression in frame 47, where she's half-sheared and looking directly at the camera, I see my own journey through life."

The artwork, created by avant-garde artist Baa-nksy (not to be confused with the human street artist), consists of 127 individual photographs taken over the course of Fluffy's 45-minute grooming session. Each image is timestamped and includes philosophical commentary such as "Frame 23: The wool begins to fall, like societal expectations dropping away" and "Frame 89: Naked truth emerges, vulnerable yet powerful."

Fluffy herself, who has been living on a small farm in Vermont, was reportedly unaware of the sale until informed by reporters. "I just wanted a haircut," she commented through her representative, a bilingual border collie. "But if my personal grooming journey can inspire others and also pay for a lifetime supply of premium oats, I guess that's nice."

The previous record for a sheep-related NFT was held by "Portrait of a Young Lamb in Deep Thought," which sold for 69 ETH last month. Critics argue that the sheep NFT market is clearly in a bubble, while supporters claim it represents the democratization of art and the elevation of farm animal consciousness.

WoolCollector.eth has announced plans to display the NFT in a virtual gallery called "The Barnyard of Dreams" and is reportedly in negotiations to acquire NFTs of other farm animals' grooming sessions.

Fluffy's next haircut is scheduled for spring 2025, and pre-orders for the NFT documentation have already reached 127 ETH in bidding.`,
    author: "Art Woolhouse",
    category: "Technology",
    publishedAt: new Date("2024-03-12"),
    readTime: "4 min",
    views: 42180,
    comments: 567,
    trending: true,
    image: "🖼️✂️",
  },
  {
    id: "5",
    title:
      "Local Sheep Starts Own Cryptocurrency Exchange, Accidentally Creates Most User-Friendly Platform in History",
    summary:
      "What began as Meadow's attempt to trade grass for grain has evolved into 'BaaEx,' a crypto exchange so intuitive that even humans can use it without confusion.",
    content: `In what technology analysts are calling "the most accidental innovation since the discovery of penicillin," a sheep named Meadow has created what may be the most user-friendly cryptocurrency exchange in existence, all while trying to figure out how to trade her excess grass for premium grain.

BaaEx (pronounced "Bay-Ex") began when Meadow, frustrated with the complexity of existing crypto platforms, decided to build her own simple trading interface. "Every exchange I tried was so confusing," Meadow explained via her translator app. "Why do humans need 47 different charts and 23 types of orders just to swap one thing for another? I just wanted to trade grass for grain!"

Using a revolutionary interface design she calls "Point and Baa," users simply indicate what they have, what they want, and how much. The platform then handles all the complex routing, fee calculations, and technical details in the background. "It's like having a conversation with a friend," said beta tester Marcus Reynolds. "I just say 'I have Bitcoin, I want Ethereum' and it happens. No PhD in computer science required."

The exchange has gained particular praise for its error messages, which include helpful phrases like "Oops! You don't have enough wool for that trade" and "That token doesn't exist, did you mean to type something else?" Instead of cryptic error codes, users receive gentle suggestions and easy-to-understand explanations.

Within three weeks of launch, BaaEx has processed over $50 million in trading volume and has a user satisfaction rating of 4.9/5 stars. Traditional exchange operators are reportedly scrambling to understand how a sheep created a better user experience than their teams of human designers.

"The secret is thinking like a customer, not like a programmer," Meadow observed. "Humans overthink everything. Sometimes the best solution is the simplest one."

Major venture capital firms have reportedly approached Meadow with funding offers, but she's currently content with her revenue model of accepting payment in premium hay and the occasional sugar cube.

The platform's success has sparked a trend of "sheep-inspired design" in the crypto industry, with several exchanges announcing plans to "simplify like a sheep."`,
    author: "Code Shepherd",
    category: "Technology",
    publishedAt: new Date("2024-03-11"),
    readTime: "5 min",
    views: 28940,
    comments: 389,
    trending: false,
    image: "💻🐑",
  },
  {
    id: "6",
    title:
      "Economists Baffled as Sheep-Only DeFi Protocol Achieves 0% Default Rate, Perfect Loan Repayment Record",
    summary:
      "FlockFi, a lending protocol that only serves sheep customers, has maintained a perfect repayment record for 18 months, leading financial experts to question everything they know about risk assessment.",
    content: `Traditional banking institutions are struggling to understand how FlockFi, a decentralized lending protocol exclusively for sheep, has maintained a 100% loan repayment rate since its inception 18 months ago, while human-operated DeFi protocols continue to struggle with defaults and liquidations.

The protocol, founded by a collective of sheep from various farms across the Midwest, operates on what they call "Honor System 2.0" - a blockchain-based trust mechanism that combines smart contracts with what sheep describe as "basic decency and community responsibility."

"It's really not that complicated," explained Buttercup, FlockFi's lead developer and a 5-year-old ewe from Kansas. "When you borrow from your neighbors, you pay it back. It's literally that simple. I don't understand why humans find this concept difficult."

The protocol's success has attracted attention from major financial institutions, with JPMorgan CEO Jamie Dimon reportedly spending three days on a farm trying to understand "the sheep mindset." Goldman Sachs has hired a team of agricultural consultants to study sheep social dynamics.

Dr. Elizabeth Garnett, a behavioral economist at Harvard, has been studying FlockFi for six months. "Their risk assessment model is revolutionary," she noted. "Instead of credit scores, they use a system based on 'grass-sharing history' and 'mutual grooming reciprocity.' Somehow, this predicts loan performance better than our sophisticated algorithms."

The sheep community attributes their success to what they call "flock accountability." Every loan is visible to the entire community, and social pressure ensures repayment. "Nobody wants to be known as the sheep who doesn't pay back their friends," explained Wooliam, FlockFi's head of community relations.

Traditional banks have attempted to replicate FlockFi's model with human customers, but initial trials have failed spectacularly. "Humans seem to view debt differently," observed Dr. Garnett. "They see it as someone else's problem. Sheep see it as a community responsibility."

FlockFi is currently expanding to offer sheep mortgages (for premium barn upgrades) and auto loans (for custom wool-transportation vehicles). The protocol has also attracted interest from other farm animal communities, with a pig-operated protocol called "OinkFinance" launching next month.`,
    author: "Professor Baa-rnard",
    category: "Analysis",
    publishedAt: new Date("2024-03-10"),
    readTime: "6 min",
    views: 19876,
    comments: 234,
    trending: false,
    image: "🏦🐑",
  },
];

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Breaking",
    "Analysis",
    "Sheep Culture",
    "Technology",
    "Comedy",
  ];

  const filteredNews =
    selectedCategory === "All"
      ? FAKE_NEWS
      : FAKE_NEWS.filter((article) => article.category === selectedCategory);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Button
            onClick={() => setSelectedArticle(null)}
            variant="outline"
            className="mb-6 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
          >
            ← Back to News
          </Button>

          <article className="space-y-6">
            <div className="text-center">
              <Badge
                className={
                  selectedArticle.category === "Breaking"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : selectedArticle.category === "Analysis"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : selectedArticle.category === "Sheep Culture"
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : selectedArticle.category === "Technology"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }
              >
                {selectedArticle.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedArticle.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedArticle.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime} read
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedArticle.views.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-center text-6xl my-8">
              {selectedArticle.image}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed">
                {selectedArticle.summary}
              </p>
              <div className="mt-8 text-lg leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{selectedArticle.comments} comments</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            📰🐑 Sheep News Network - The Wooliest News in Crypto
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-red-400 drop-shadow-lg font-bold">SHEEP</span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">NEWS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest breaking news from the sheep crypto
            community! From revolutionary trading strategies to hilarious market
            mishaps, we've got all the wool-worthy updates! 🐑📰
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-red-500 hover:bg-red-600"
                  : "border-red-500/50 text-red-400 hover:bg-red-500/20"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Trending News */}
        {selectedCategory === "All" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-orange-400" />
              🔥 Trending Now
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FAKE_NEWS.filter((article) => article.trending)
                .slice(0, 4)
                .map((article) => (
                  <Card
                    key={article.id}
                    className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer hover:scale-105"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={
                            article.category === "Breaking"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : article.category === "Analysis"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : article.category === "Sheep Culture"
                                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                  : article.category === "Technology"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {article.category}
                        </Badge>
                        <div className="text-2xl">{article.image}</div>
                      </div>
                      <CardTitle className="text-orange-400 text-lg leading-tight">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {article.summary}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{article.author}</span>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {article.comments}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All News */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            📰 {selectedCategory === "All" ? "Latest News" : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card
                key={article.id}
                className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={
                        article.category === "Breaking"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : article.category === "Analysis"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : article.category === "Sheep Culture"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : article.category === "Technology"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {article.category}
                    </Badge>
                    <div className="text-2xl">{article.image}</div>
                  </div>
                  <CardTitle className="text-purple-400 text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {article.comments}
                      </div>
                    </div>
                    {article.trending && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                        Trending
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
