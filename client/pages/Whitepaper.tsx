import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Eye, Share2 } from "lucide-react";

const sections = [
  {
    title: "Executive Summary",
    description:
      "An overview of Lambaaaghini's mission to revolutionize luxury DeFi on Solana.",
  },
  {
    title: "Technology Architecture",
    description:
      "Deep dive into our high-performance protocols and smart contract design.",
  },
  {
    title: "Tokenomics",
    description:
      "Comprehensive breakdown of token distribution, utility, and governance model.",
  },
  {
    title: "Security Framework",
    description:
      "Our multi-layered security approach and audit results from leading firms.",
  },
  {
    title: "Roadmap & Vision",
    description:
      "Long-term strategic goals and development milestones through 2025.",
  },
  {
    title: "Team & Advisors",
    description:
      "Meet the industry veterans and blockchain experts behind Lambaaaghini.",
  },
];

export default function Whitepaper() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge className="mb-8 bg-gold-500/10 text-gold-400 border-gold-500/20">
            📄 Technical Documentation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Whitepaper</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive technical documentation covering our vision,
            technology, and strategy for revolutionizing luxury DeFi.
          </p>
        </div>

        {/* Download Section */}
        <Card className="glass-card border-gold-500/20 mb-12">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gold-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              Lambaaaghini Whitepaper v2.0
            </h2>
            <p className="text-muted-foreground mb-8">
              Released January 2024 • 48 pages • Technical & Business Overview
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Online
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sections Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What's <span className="gradient-text">Inside</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Card
                key={index}
                className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="glass-card border-muted/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <p className="text-muted-foreground mb-6">
              Explore our technical documentation, API references, and developer
              guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                Developer Docs
              </Button>
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                API Reference
              </Button>
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                GitHub Repository
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
