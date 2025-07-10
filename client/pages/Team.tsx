import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Twitter, Github } from "lucide-react";

const teamMembers = [
  {
    name: "Why",
    role: "Co-Founder & CEO",
    bio: "",
    initials: "AR",
    links: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "You",
    role: "Co-Founder & CTO",
    bio: "",
    initials: "SC",
    links: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Wanna",
    role: "Head of Security",
    bio: "",
    initials: "MT",
    links: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Know",
    role: "Head of Product",
    bio: "",
    initials: "EV",
    links: {
      linkedin: "#",
      twitter: "#",
    },
  },
];

const advisors = [
  {
    name: "Dr. Ain't",
    role: "Strategic Advisor",
    bio: ".",
    initials: "JW",
  },
  {
    name: "Tellin you",
    role: "Technical Advisor",
    bio: "",
    initials: "RK",
  },
  {
    name: "Shit",
    role: "Business Advisor",
    bio: "",
    initials: "DP",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-8 bg-purple-500/10 text-purple-400 border-purple-500/20">
            👥 Meet the Team
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            World-Class <span className="gradient-text">Talent</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our team combines decades of meme experience and several months of
            solana memecoin trading insites along with the best ai to bridge our
            tremendous gaps in skils
          </p>
        </div>

        {/* Core Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:crypto-glow"
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-purple-600">
                    <AvatarFallback className="text-black font-bold text-lg">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gold-400 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {member.bio || ""}
                  </p>
                  <div className="flex justify-center space-x-3">
                    {member.links?.linkedin && (
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    {member.links?.twitter && (
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {member.links?.github && (
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Strategic Advisors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisors.map((advisor) => (
              <Card
                key={advisor.name}
                className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-gold-600">
                    <AvatarFallback className="text-black font-bold">
                      {advisor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold mb-1">{advisor.name}</h3>
                  <p className="text-purple-400 font-medium mb-3">
                    {advisor.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {advisor.bio || ""}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Join Us */}
        <Card className="glass-card border-gold-500/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We are almost never looking for talent but you are more than
              welcome to donate sol to this address and I promise you aren't
              going to get a job or benefit in any way from it and we aren't
              using it towards the project:
              F52riGC1evYR12ZqQy9umRo7S3hDAZhFbXGEnuX8p966
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-semibold">
                View Open Positions
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                Learn About Our Culture
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
