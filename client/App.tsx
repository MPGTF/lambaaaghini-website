import "./global.css";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletProvider from "./components/WalletProvider";
import { UserProvider } from "./contexts/UserContext";
import Navigation from "./components/Navigation";
import SassyChatbot from "./components/SassyChatbot";
import LandingPage from "./pages/LandingPage";
import TestHome from "./pages/TestHome";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Trading from "./pages/Trading";
import Launchpad from "./pages/Launchpad";
import Dex from "./pages/Dex";
import Leaderboards from "./pages/Leaderboards";
import Academy from "./pages/Academy";
import News from "./pages/News";
import PayTheLamb from "./pages/PayTheLamb";
import LambSauce from "./pages/LambSauce";
import LambPooperScooper from "./pages/LambPooperScooper";
import MarketingProposals from "./pages/MarketingProposals";
import TweetToLaunch from "./pages/TweetToLaunch";
import Game from "./pages/Game";
import Roadmap from "./pages/Roadmap";
import Whitepaper from "./pages/Whitepaper";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasEntered, setHasEntered] = useState(false);

  // Check if user has previously entered
  useEffect(() => {
    const entered = localStorage.getItem("lambaaaghini-entered");
    if (entered === "true") {
      setHasEntered(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("lambaaaghini-entered", "true");
    setHasEntered(true);
  };

  // Show landing page if user hasn't entered yet
  if (!hasEntered) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <UserProvider>
              <Toaster />
              <Sonner />
              <LandingPage onEnter={handleEnter} />
            </UserProvider>
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <UserProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Navigation />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/trading" element={<Trading />} />
                    <Route path="/launchpad" element={<Launchpad />} />
                    <Route path="/dex" element={<Dex />} />
                    <Route path="/leaderboards" element={<Leaderboards />} />
                    <Route path="/academy" element={<Academy />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/pay-the-lamb" element={<PayTheLamb />} />
                    <Route path="/lamb-sauce" element={<LambSauce />} />
                    <Route
                      path="/lamb-pooper-scooper"
                      element={<LambPooperScooper />}
                    />
                    <Route
                      path="/marketing-proposals"
                      element={<MarketingProposals />}
                    />
                    <Route path="/game" element={<Game />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/whitepaper" element={<Whitepaper />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <SassyChatbot />
              </div>
            </BrowserRouter>
          </UserProvider>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
