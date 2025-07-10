import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletProvider from "./components/WalletProvider";
import Navigation from "./components/Navigation";
import TestHome from "./pages/TestHome";
// import Index from "./pages/Index";
// import Launchpad from "./pages/Launchpad";
// import Game from "./pages/Game"; // Temporarily disabled
// import Roadmap from "./pages/Roadmap";
// import Whitepaper from "./pages/Whitepaper";
// import Team from "./pages/Team";
// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <div>
    <Navigation />
    <div>
      <TestHome />
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(<App />);
