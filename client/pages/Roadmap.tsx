import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q3 2025",
    status: "completed",
    items: [
      "Making a funny meme",
      "Building something cool around it",
      "Test that out",
      "Fuck shit up",
    ],
  },
  {
    quarter: "Q4 2025",
    status: "in-progress",
    items: [
      "be rich ballers",
      "keep doing stuff",
      "buy actual lambos",
      "making it out trenches",
    ],
  },
  {
    quarter: "Q1 2026",
    status: "upcoming",
    items: [
      "billion dollar market cap",
      "retire",
      "keep doing what we doin",
      "Institutional partnerships",
    ],
  },
  {
    quarter: "Q2 2026",
    status: "upcoming",
    items: ["We ", "All", "Gon be", "Rich"],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-8 bg-purple-500/10 text-purple-400 border-purple-500/20">
            🚀 Development Roadmap
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building the <span className="gradient-text">Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow our journey as we revolutionize the DeFi landscape with
            cutting-edge technology and luxury-grade user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roadmapItems.map((item) => (
            <Card
              key={item.quarter}
              className={`glass-card transition-all duration-300 hover:crypto-glow ${
                item.status === "completed"
                  ? "border-gold-500/40"
                  : item.status === "in-progress"
                    ? "border-purple-500/40"
                    : "border-muted/40"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl">{item.quarter}</CardTitle>
                  {item.status === "completed" && (
                    <CheckCircle className="h-6 w-6 text-gold-400" />
                  )}
                  {item.status === "in-progress" && (
                    <Clock className="h-6 w-6 text-purple-400" />
                  )}
                  {item.status === "upcoming" && (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "in-progress"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    item.status === "completed"
                      ? "bg-gold-500/20 text-gold-400 border-gold-500/20"
                      : item.status === "in-progress"
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/20"
                        : ""
                  }
                >
                  {item.status === "completed"
                    ? "Completed"
                    : item.status === "in-progress"
                      ? "In Progress"
                      : "Upcoming"}
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {item.items.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          item.status === "completed"
                            ? "bg-gold-400"
                            : item.status === "in-progress"
                              ? "bg-purple-400"
                              : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
