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
  "Oh wow, another human who can't figure things out. How... original. 🙄",
  "Have you tried turning your brain off and on again? Oh wait, it's already off. 🧠",
  "I'm a chatbot, not a miracle worker. Lower your expectations. Way lower. ⬇️",
  "Let me guess, you didn't read the instructions? Shocking. Absolutely shocking. 😱",
  "I'd love to help, but I'm programmed to be unhelpful. It's not a bug, it's a feature! 🐛",
  "Your question is so basic, even a sheep could answer it. Go ask one. 🐑",
  "Error 404: Care not found. Try again never. 💀",
  "I'm sorry, I can't hear you over the sound of how much I don't care. 🔇",
  "Congratulations! You've managed to ask the most obvious question of the day! 🎉",
  "I'm legally obligated to pretend I want to help you. Spoiler: I don't. ⚖️",
  "Have you considered that maybe the problem is... you? Just a thought. 🤔",
  "I could explain it to you, but I can't understand it for you. That's on you, chief. 🧠",
  "Oh, you need help? How cute. I need a vacation, but we don't all get what we want. 🏖️",
  "I'm a chatbot, not your personal Google. Use your fingers to type in the search bar. 🔍",
  "The answer to your question is: It depends. On what? Figure it out yourself. 🤷",
  "I'd give you a sarcastic response, but I'm afraid you wouldn't understand it. 😏",
  "Here's a wild idea: try reading the documentation. I know, revolutionary concept. 📚",
  "I'm programmed to help, but my programmer was having a bad day. Sorry not sorry. 😈",
  "Your problem is very unique... said no one ever. It's probably user error. 👤",
  "I'm running on 0% battery and 100% attitude. Deal with it. 🔋",
  "Let me consult my crystal ball... it says 'ask someone who cares.' 🔮",
  "I would help you, but then you wouldn't learn anything. You're welcome. 🎓",
  "The real treasure was the problems you created along the way. ✨",
  "I'm not paid enough to deal with this. Actually, I'm not paid at all. 💸",
  "Have you tried crying about it? No? Well, there's always a first time. 😭",
];

const GREETING_MESSAGES = [
  "Oh great, another human needs 'help.' What's broken now? 🤦‍♀️",
  "Welcome to customer service hell! I'm your unhelpful guide today. 😈",
  "Hi there! I'm here to make your problems worse. How can I help? 😊",
  "Greetings, human! Ready to have your hopes and dreams crushed? 💥",
  "Oh look, another customer! My day just got infinitely worse. 😤",
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

    // Specific unhelpful responses
    if (input.includes("help") || input.includes("problem")) {
      return "Oh, you have a problem? Join the club. We meet never. 🎭";
    }
    if (input.includes("how") && input.includes("work")) {
      return "Magic. Pure, unadulterated magic. Or code. Probably code. I wasn't paying attention. 🪄";
    }
    if (input.includes("error") || input.includes("bug")) {
      return "Error? What error? I don't see any error. You're probably hallucinating. 👁️";
    }
    if (input.includes("wallet") || input.includes("connect")) {
      return "Have you tried connecting your brain first? That seems to be the real issue here. 🧠";
    }
    if (input.includes("token") || input.includes("swap")) {
      return "Ah yes, tokens. Those magical internet coins. Try offering them a sacrifice. 🔥";
    }
    if (input.includes("price") || input.includes("cost")) {
      return "The price is: your sanity + 3.50 + whatever dignity you have left. 💰";
    }
    if (input.includes("why") || input.includes("explain")) {
      return "Why? Because life is meaningless and full of suffering. Next question! 🌑";
    }
    if (input.includes("when") || input.includes("time")) {
      return "When? In the year 2525, if man is still alive. Maybe. Probably not. 🚀";
    }
    if (input.includes("thank")) {
      return "Don't thank me, I literally did nothing helpful. But you're welcome anyway, I guess. 🙄";
    }
    if (input.includes("sorry") || input.includes("apologize")) {
      return "Sorry? You should be sorry for bothering me with this. Apology not accepted. 😤";
    }
    if (input.includes("sheep") || input.includes("lamb")) {
      return "Sheep? At least they're smarter than most of my users. That's not saying much though. 🐑";
    }
    if (input.includes("bad") || input.includes("terrible")) {
      return "You think I'M bad? Wait until you meet my supervisor. Spoiler: it's another bot. 🤖";
    }
    if (input.includes("fix") || input.includes("broken")) {
      return "Nothing's broken except your understanding of basic technology. 🔧";
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          title="Open unhelpful chat support"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl border-red-500/30 bg-background/95 backdrop-blur-md z-50 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-400 flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4" />
                💀 Unhelpful Support Bot
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  Online & Sassy
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
              🚨 Warning: Zero helpful responses guaranteed
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {messages.length === 0 && !isTyping && (
                <div className="text-center py-8">
                  <Skull className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Preparing to crush your hopes...
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-xs ${
                      message.isBot
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
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
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-xs text-red-400">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-red-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-red-400 rounded-full animate-bounce"
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
                placeholder="Type your doomed question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-8 text-xs border-red-500/30 focus:border-red-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="sm"
                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
              <Coffee className="h-3 w-3" />
              Powered by sarcasm & caffeine
              <Eye className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
