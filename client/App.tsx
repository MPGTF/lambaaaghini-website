import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalletProvider from "./components/WalletProvider";

// Import working navigation
import Navigation from "./components/Navigation";

// Test components for problematic pages
const TestGame = () => (
  <div
    style={{
      backgroundColor: "blue",
      color: "white",
      padding: "20px",
      margin: "20px",
    }}
  >
    <h1>🎮 TEST GAME PAGE - WORKING!</h1>
    <p>Game component temporarily disabled for testing</p>
  </div>
);

// Import simple pages first (these are less likely to crash)
import Roadmap from "./pages/Roadmap";
import Whitepaper from "./pages/Whitepaper";
import Team from "./pages/Team";

// Import potentially problematic pages
// import Index from "./pages/Index"; // ← DISABLED - This component is crashing
// import Launchpad from "./pages/Launchpad";  // ← Complex AI/wallet stuff
// import Game from "./pages/Game";  // ← Complex game logic
// import BarrioGame from "./pages/BarrioGame";  // ← Complex game logic

// Create minimal test version of Index
const MinimalIndex = () => (
  <div
    style={{
      backgroundColor: "green",
      color: "white",
      padding: "20px",
      margin: "20px",
    }}
  >
    <h1>🐑 MINIMAL INDEX TEST</h1>
    <p>Testing which part of Index.tsx is crashing...</p>
    <p>If you see this, basic Index structure works</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <BrowserRouter>
          <div
            className="min-h-screen"
            style={{ backgroundColor: "#000", color: "#fff" }}
          >
            <Navigation />
            <main style={{ paddingTop: "64px" }}>
              <Routes>
                {/* Test minimal homepage */}
                <Route path="/" element={<MinimalIndex />} />

                {/* Test simple pages that should work */}
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/team" element={<Team />} />

                {/* Complex pages disabled for now */}
                <Route path="/launchpad" element={<TestGame />} />
                <Route path="/game" element={<TestGame />} />
                <Route path="/barrio" element={<TestGame />} />

                <Route
                  path="*"
                  element={
                    <div
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                        padding: "20px",
                        margin: "20px",
                      }}
                    >
                      <h1>🐑 404 - Page Not Found</h1>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
