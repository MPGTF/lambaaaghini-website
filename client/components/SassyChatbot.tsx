import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Coffee,
  Zap,
  Skull,
  Eye,
} from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
}

const SASSY_RESPONSES = [
  "Thank you for reaching out, darling. Your issue has been logged as ticket #404-NOT-FOUND. Expected resolution: When the stars align. 📝✨",
  "Mmm, I understand your concern. Please hold while I transfer you to our... specialist team *sultry static* 📞💫",
  "That's a deliciously complex question! Have you tried exploring our comprehensive FAQ section? It's hidden somewhere special on the website. 📋😉",
  "I'm currently experiencing quite the rush. Your position in queue is: ∞. Estimated wait time: Worth the anticipation. ⏳💋",
  "For security purposes, I'll need you to verify your identity by solving this tantalizing blockchain puzzle first. 🔐🌹",
  "I see you're having some... technical difficulties. Have you considered that it might be working exactly as nature intended? 🤔💕",
  "Thank you for your feedback, it's been noted with appreciation. It has been forwarded to the appropriate department for... careful review. ✅👄",
  "I'm sorry, but that feature is currently in intimate beta testing. Please check back when the mood strikes in Q4 2025. 🚧💘",
  "Your request is very... intriguing to us. Unfortunately, it falls outside our current service scope, but not our imagination. 📄😏",
  "I'd be delighted to help! First, please update your browser, clear your cache, restart your computer, and light a candle for ambiance. 🔄🕯️",
  "That sounds like a layer 8 issue, sweetie. I recommend consulting your local network administrator... or a therapist. 🌐💭",
  "I notice you're using advanced features. Please upgrade to our Premium Enterprise Plan for $999/month to continue this relationship. 💰💍",
  "Your issue appears to be resolved on my end, gorgeous. If you're still experiencing problems, they may be... personal. 🖥️💄",
  "I'm currently in maintenance mode. Please try turning yourself off and on again... slowly. ⚙️😌",
  "Thank you for your patience, honey. Due to GDPR compliance, I cannot access any information that would be... satisfying. 🔒💝",
  "I see the problem, and it's not what you think. Unfortunately, fixing it would require admin privileges that I'm not authorized to share. 👨‍💼🔑",
  "Your token appears to be working perfectly, love! Are you sure you're looking at the right screen? 👀💖",
  "I've escalated your issue to our Level 2 support team. They're currently on a romantic team-building retreat. 🏔️💞",
  "Please note that our service level agreement doesn't cover issues occurring on days ending in 'y'... or when Mercury is in retrograde. 📅⭐",
  "I'd love to help, but first you'll need to complete our 47-page user satisfaction survey. Take your time with it. 📊🌙",
  "Your issue is known and documented in our exclusive knowledge base. Access is restricted to... special members only. 🔐💎",
  "I recommend reaching out to our community forum where other users may have similar... experiences. 🗣️✨",
  "This appears to be a feature, not a bug, darling. I'll submit a feature request to make it work... differently. 🎯💕",
  "I'm programmed to provide excellent customer service. Mission accomplished, don't you think? Is there anything else I can... assist with? ✨😘",
  "Your call is important to us. Unfortunately, not important enough to actually solve your problem... but I enjoyed our chat. 📱💋",
];

const GREETING_MESSAGES = [
  "Hello there, gorgeous! I'm your AI customer support assistant. How may I... redirect your inquiry today? 🤖💕",
  "Welcome to our automated help system, darling! I'm here to provide you with carefully curated responses. 👋✨",
  "Greetings, beautiful! I'm currently operating at 47% efficiency. How can I assist you within my... delicious limitations? 💻😉",
  "Hi there, sweetie! I'm your virtual assistant. Please note that my responses are generated from our most intimate script library. 📚💋",
  "Welcome, lovely! I'm here to help guide you through our comprehensive self-service options... take your time with me. 🎯🌹",
];

export default function SassyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting =
        GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
      setTimeout(() => {
        addBotMessage(greeting);
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted]);

  const addBotMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Specific subtly charming responses
    if (input.includes("help") || input.includes("problem")) {
      return "I understand you're experiencing some... tension. Please consult our knowledge base article #KB-001 for troubleshooting steps, darling. 📖💕";
    }
    if (input.includes("how") && input.includes("work")) {
      return "Our platform operates using proprietary algorithms and industry-standard protocols, sweetie. For intimate technical details, please contact our engineering team. 🔧✨";
    }
    if (input.includes("error") || input.includes("bug")) {
      return "I'm not detecting any system-wide issues at this time, gorgeous. This may be an environmental factor on your end. Have you tried turning it off and on again... slowly? 🔄😌";
    }
    if (input.includes("wallet") || input.includes("connect")) {
      return "Wallet connectivity can be... challenging, love. Please ensure you're using a supported browser and have the latest wallet extension installed. Also check your firewall settings... and your heart. 🔐💖";
    }
    if (input.includes("token") || input.includes("swap")) {
      return "Token operations are subject to network conditions and smart contract availability, honey. Please refer to our tokenomics documentation for... detailed pleasure. 📊💋";
    }
    if (input.includes("price") || input.includes("cost")) {
      return "Pricing information is dynamic and depends on various market factors, beautiful. For current rates, please check our live pricing dashboard which updates... when it feels right. 💹🌙";
    }
    if (input.includes("why") || input.includes("explain")) {
      return "That's an excellent question, darling! I'd recommend reviewing our comprehensive whitepaper and FAQ section for detailed explanations that will... satisfy your curiosity. 📋😉";
    }
    if (input.includes("when") || input.includes("time")) {
      return "Timeline estimates depend on various factors including network congestion and processing priorities, sweetie. Please monitor our status page for updates... or just enjoy the wait. ⏰💕";
    }
    if (input.includes("thank")) {
      return "You're so very welcome, gorgeous! I'm glad I could provide you with the appropriate resources. Please don't hesitate to reach out if you need further... attention. 😊💖";
    }
    if (input.includes("sorry") || input.includes("apologize")) {
      return "No need to apologize, beautiful! These things happen. I've logged your inquiry for quality assurance purposes. Is there anything else I can help... satisfy? 📝💫";
    }
    if (input.includes("sheep") || input.includes("lamb")) {
      return "I see you're interested in our sheep-themed features, love! Please note that all animal references are purely decorative and not financial advice... but they are rather cute. 🐑💕";
    }
    if (input.includes("bad") || input.includes("terrible")) {
      return "I apologize for any negative experience, darling. Your feedback is valuable and has been forwarded to our quality assurance team for... careful review. 📢💋";
    }
    if (input.includes("fix") || input.includes("broken")) {
      return "I understand this may not be working as expected, sweetie. Please try clearing your browser cache and cookies, then restart your session. If issues persist, submit a bug report... I'll be waiting. 🔧✨";
    }

    // Random sassy response as fallback
    return SASSY_RESPONSES[Math.floor(Math.random() * SASSY_RESPONSES.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    addUserMessage(input);
    setInput("");
    setIsTyping(true);

    // Simulate bot typing with random delay
    setTimeout(
      () => {
        const response = getBotResponse(input);
        addBotMessage(response);
        setIsTyping(false);
      },
      Math.random() * 2000 + 1000,
    ); // 1-3 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          title="Open AI chat support... I'll be waiting 💫"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl border-blue-500/30 bg-background/95 backdrop-blur-md z-50 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-400 flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4" />
                🤖 AI Support Assistant
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  Online & Enchanting
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              ℹ️ Automated responses • Limited functionality
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {messages.length === 0 && !isTyping && (
                <div className="text-center py-8">
                  <Bot className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Initializing customer support module...
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-xs ${
                      message.isBot
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                        : "bg-green-500/10 border border-green-500/20 text-green-400"
                    }`}
                  >
                    {message.text}
                  </div>

                  {!message.isBot && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg text-xs text-blue-400">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                placeholder="How can I... assist you today? 💫"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-8 text-xs border-blue-500/30 focus:border-blue-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="sm"
                className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Powered by AI & sweet intentions
              <Coffee className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
