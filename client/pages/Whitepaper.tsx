import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Eye, Share2 } from "lucide-react";

const sections = [
  {
    title: "Full Disclosure",
    description:
      "We have absolutely no technical skills and used generative AI to build everything including this launchpad using pump.fun's API.",
  },
  {
    title: "Zero Promises",
    description:
      "This document makes no assurances, guarantees, or promises of any kind. We literally don't know what we're doing.",
  },
  {
    title: "Lambs in the Meadow",
    description:
      "A poetic meditation on lambs racing luxury cars through endless meadows - the true inspiration behind Lambaaaghini.",
  },
  {
    title: "AI Generated Everything",
    description:
      "Every line of code, every design decision, and most of this whitepaper was created by artificial intelligence.",
  },
  {
    title: "No Roadmap Just Vibes",
    description:
      "We have no technical roadmap because we don't understand technology. Just good vibes and meme energy.",
  },
  {
    title: "Why You Should Not Invest",
    description:
      "Comprehensive reasons why investing in this project is probably a terrible idea.",
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
            A completely honest document about how we used AI to build a meme
            coin launchpad without any technical knowledge whatsoever. No
            promises, just transparency.
          </p>
        </div>

        {/* Download Section */}
        <Card className="glass-card border-gold-500/20 mb-12">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gold-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              Lambaaaghini "Whitepaper" v2.0
            </h2>
            <p className="text-muted-foreground mb-8">
              Released Yesterday • 3 pages • AI-Generated Honesty & Lamb Poetry
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

        {/* Kanye-Style Lamb Poetry */}
        <Card className="glass-card border-gold-500/20 mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
              The Lambs in the Meadow: A Vision
            </h2>
            <div className="text-lg leading-relaxed space-y-4 italic text-center max-w-4xl mx-auto">
              <p>
                "I had a vision... I seen lambs, beautiful lambs, racing through
                emerald meadows in Lambaaaghinis made of pure golden wool..."
              </p>
              <p>
                "These ain't regular lambs, these are VISIONARY lambs, these are
                GENIUS lambs, these lambs got that ENERGY, that FREQUENCY, that
                VIBRATION..."
              </p>
              <p>
                "Picture this: A lamb behind the wheel of a Huracán, wool
                flowing in the wind like silk scarves at Fashion Week, hooves on
                the pedals, driving through meadows of infinite possibility..."
              </p>
              <p>
                "The sound of V10 engines mixed with gentle bleating, creating
                the most beautiful symphony ever created in the history of
                MUSIC, in the history of AUTOMOBILES, in the history of
                LAMBS..."
              </p>
              <p>
                "This is what Lambaaaghini represents. This is the ENERGY. This
                is why we exist. This is bigger than cryptocurrency. This is
                ART. This is CULTURE. This is LAMBS IN LAMBAAAGHINIS."
              </p>
              <p className="text-gold-400 font-bold text-xl">
                "WE ARE THE LAMBS. WE ARE THE MEADOW. WE ARE THE LAMBAAAGHINI."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Section */}
        <Card className="glass-card border-red-500/20 mb-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              🚨 IMPORTANT DISCLAIMER 🚨
            </h2>
            <div className="text-left space-y-4 max-w-4xl mx-auto">
              <p className="text-muted-foreground">
                <strong>NO TECHNICAL EXPERTISE:</strong> We have zero technical
                skills. Everything was built using AI.
              </p>
              <p className="text-muted-foreground">
                <strong>AI-GENERATED EVERYTHING:</strong> Our launchpad was
                created using ChatGPT, Claude, and pump.fun's API documentation.
              </p>
              <p className="text-muted-foreground">
                <strong>NO PROMISES:</strong> We make no guarantees, assurances,
                or promises about anything. Ever.
              </p>
              <p className="text-muted-foreground">
                <strong>PROBABLY A BAD INVESTMENT:</strong> This is likely a
                terrible financial decision.
              </p>
              <p className="text-muted-foreground">
                <strong>WE DON'T UNDERSTAND:</strong> Smart contracts,
                tokenomics, or how any of this actually works.
              </p>
              <p className="text-muted-foreground">
                <strong>BUT:</strong> We do understand lambs, and we do
                understand vibes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="glass-card border-muted/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Additional "Resources"</h2>
            <p className="text-muted-foreground mb-6">
              Links to things we found on the internet and copy-pasted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                AI Prompts We Used
              </Button>
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                Pump.fun Documentation
              </Button>
              <Button
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
              >
                YouTube Tutorials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
