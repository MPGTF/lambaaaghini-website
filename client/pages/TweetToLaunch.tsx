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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Twitter,
  Rocket,
  Clock,
  Smartphone,
  Zap,
  Gamepad2,
  MessageSquare,
  Phone,
  Mail,
  Megaphone,
  Bot,
  Wifi,
  Radio,
  Send,
  AlertTriangle,
  Calendar,
  Snail,
  Newspaper,
  Flag,
} from "lucide-react";

interface LaunchMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  comingSoon: boolean;
  processingTime?: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  details: string;
}

const electronicMethods: LaunchMethod[] = [
  {
    id: "tweet",
    name: "Tweet-to-Launch",
    description: "Launch tokens by tweeting the token name and ticker",
    icon: <Twitter className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "Instant",
    difficulty: "Easy",
    details:
      "Simply tweet your token name + ticker and mention us. Our AI will automatically deploy your token on pump.fun!",
  },
  {
    id: "text",
    name: "Text-to-Launch",
    description: "SMS your token details to our dedicated number",
    icon: <Smartphone className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "< 5 minutes",
    difficulty: "Easy",
    details:
      "Text 'LAUNCH TokenName + TICKER' to our number and we'll deploy instantly. Perfect for mobile users!",
  },
  {
    id: "ai",
    name: "AI Chat-to-Launch",
    description: "Describe your token to our AI assistant",
    icon: <Bot className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "< 2 minutes",
    difficulty: "Easy",
    details:
      "Have a conversation with our AI about your token idea. It'll help you refine it and launch automatically!",
  },
  {
    id: "game",
    name: "Game-to-Launch",
    description: "Complete mini-games to unlock token creation",
    icon: <Gamepad2 className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "10-30 minutes",
    difficulty: "Medium",
    details:
      "Play our sheep-themed games and earn launch credits. Beat the high score to unlock premium token features!",
  },
  {
    id: "shout",
    name: "Shout-to-Launch",
    description: "Voice commands via microphone detection",
    icon: <Megaphone className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "< 1 minute",
    difficulty: "Medium",
    details:
      "Shout your token details into your device. Our voice recognition will parse and launch your token!",
  },
  {
    id: "wifi",
    name: "WiFi Name-to-Launch",
    description: "Encode token details in your WiFi network name",
    icon: <Wifi className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "5-15 minutes",
    difficulty: "Hard",
    details:
      "Change your WiFi name to include token details. Our scanners will detect and deploy automatically!",
  },
  {
    id: "morse",
    name: "Morse Code-to-Launch",
    description: "Tap out token details in morse code",
    icon: <Radio className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "Variable",
    difficulty: "Extreme",
    details:
      "Use our morse code interface to tap out your token details. For the truly dedicated sheep enthusiasts!",
  },
];

const oldSchoolMethods: LaunchMethod[] = [
  {
    id: "phone",
    name: "Call-to-Launch",
    description: "Phone in your token details to our operators",
    icon: <Phone className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "4-6 weeks",
    difficulty: "Easy",
    details:
      "Call 1-800-LAMBAAAA and speak with our trained operators. They'll take your token details and process manually. Please allow 4-6 weeks for deployment as all information is processed by hand and verified through multiple departments.",
  },
  {
    id: "mail",
    name: "Snail Mail-to-Launch",
    description: "Mail your token proposal via postal service",
    icon: <Mail className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "4-6 weeks",
    difficulty: "Medium",
    details:
      "Send a handwritten letter with your token details to our headquarters. Include a self-addressed stamped envelope for confirmation. Processing takes 4-6 weeks as each letter is reviewed by our board of sheep advisors.",
  },
  {
    id: "carrier",
    name: "Carrier Pigeon-to-Launch",
    description: "Attach your proposal to a trained pigeon",
    icon: <Send className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "6-8 weeks",
    difficulty: "Hard",
    details:
      "Train a pigeon to carry your token proposal to our offices. Weather dependent. Processing time includes pigeon training, flight time, and our traditional 4-6 week manual review process.",
  },
  {
    id: "newspaper",
    name: "Classified Ad-to-Launch",
    description: "Place a classified ad in your local newspaper",
    icon: <Newspaper className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "6-10 weeks",
    difficulty: "Medium",
    details:
      "Place an ad in the 'Sheep & Supercars' section of your local newspaper. Our team reads newspapers from around the world daily. Processing includes ad discovery time plus standard 4-6 week review.",
  },
  {
    id: "smoke",
    name: "Smoke Signal-to-Launch",
    description: "Send token details via traditional smoke signals",
    icon: <Flag className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "8-12 weeks",
    difficulty: "Extreme",
    details:
      "Use traditional smoke signal methods to communicate your token details. Our trained smoke signal readers check the skies daily. Weather dependent and includes our standard 4-6 week processing period.",
  },
  {
    id: "bottle",
    name: "Message in a Bottle-to-Launch",
    description: "Float your proposal across the ocean",
    icon: <Snail className="w-6 h-6" />,
    comingSoon: true,
    processingTime: "3-24 months",
    difficulty: "Extreme",
    details:
      "Write your token details on parchment, seal in a bottle, and release into the ocean. Our beach patrol teams check shorelines globally. Highly dependent on ocean currents and tides. Processing includes discovery time plus 4-6 weeks manual review.",
  },
];

export default function TweetToLaunch() {
  const [activeTab, setActiveTab] = useState("convenient");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-orange-100 text-orange-800";
      case "Extreme":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">
          🐑
        </div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">
          🚗
        </div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-spin-slow">
          💨
        </div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce">
          🚀
        </div>
        <div className="absolute bottom-20 right-10 text-4xl animate-pulse">
          📞
        </div>
        <div className="absolute top-1/2 left-10 text-3xl animate-bounce">
          📮
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/lamb-car.png"
              alt="LAMBAAAGHINI"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              Ways to Launch
            </h1>
            <Rocket className="w-12 h-12 text-orange-600" />
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            🐑 Choose your preferred method to launch tokens on LAMBAAAGHINI!
            From cutting-edge digital solutions to time-honored traditional
            approaches. 🚗💨
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="convenient" className="text-lg font-semibold">
              <Zap className="w-5 h-5 mr-2" />
              Convenient Ways
            </TabsTrigger>
            <TabsTrigger value="inconvenient" className="text-lg font-semibold">
              <Clock className="w-5 h-5 mr-2" />
              Inconvenient Ways
            </TabsTrigger>
          </TabsList>

          {/* Convenient (Electronic) Methods */}
          <TabsContent value="convenient">
            <div className="text-center mb-8">
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2 mb-4">
                ⚡ Modern Electronic Methods
              </Badge>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Lightning-fast digital solutions for the modern sheep
                enthusiast. Deploy tokens in minutes using cutting-edge
                technology!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {electronicMethods.map((method) => (
                <Card
                  key={method.id}
                  className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {method.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {method.name}
                          </CardTitle>
                          <Badge
                            className={`text-xs ${getDifficultyColor(method.difficulty)}`}
                          >
                            {method.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {method.comingSoon && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Processing Time:
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {method.processingTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {method.details}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inconvenient (Old School) Methods */}
          <TabsContent value="inconvenient">
            <div className="text-center mb-8">
              <Badge className="bg-amber-100 text-amber-800 text-lg px-4 py-2 mb-4">
                🕰️ Traditional Methods
              </Badge>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Time-tested approaches for those who appreciate the finer,
                slower things in life. Perfect for building character and
                patience!
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Important Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  All traditional methods require manual processing by our team
                  of dedicated sheep experts. Please allow 4-6 weeks minimum for
                  processing, verification, and deployment.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oldSchoolMethods.map((method) => (
                <Card
                  key={method.id}
                  className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          {method.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {method.name}
                          </CardTitle>
                          <Badge
                            className={`text-xs ${getDifficultyColor(method.difficulty)}`}
                          >
                            {method.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {method.comingSoon && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Processing Time:
                        </span>
                        <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {method.processingTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {method.details}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Phone className="w-6 h-6 text-purple-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-800 mb-1">
                    Phone Launch Hotline
                  </div>
                  <div className="text-purple-700">1-800-LAMBAAAA</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Available 24/7 for token deployments
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-800 mb-1">
                    Postal Address
                  </div>
                  <div className="text-purple-700 text-xs leading-relaxed">
                    LAMBAAAGHINI Token Launch Division
                    <br />
                    123 Sheep Street
                    <br />
                    Supercar City, SC 12345
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">
                * Traditional methods are processed in order of receipt.
                Processing time may vary based on sheep availability and weather
                conditions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-12">
          <p className="text-lg mb-4">
            🐑 Powered by LAMBAAAGHINI - Where Innovation Meets Tradition! 🚗
          </p>
          <p className="text-sm">
            Whether you prefer the speed of technology or the charm of
            tradition, we've got you covered!
          </p>
        </div>
      </div>
    </div>
  );
}
