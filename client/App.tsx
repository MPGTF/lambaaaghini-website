import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./components/WalletProvider";

// Import working navigation
import Navigation from "./components/Navigation";

// Import simple pages
import Roadmap from "./pages/Roadmap";
import Whitepaper from "./pages/Whitepaper";
import Team from "./pages/Team";

// Import working components
import IndexUltraMinimal from "./pages/Index-ultra-minimal";
import GameSimple from "./pages/GameSimple";
import Launchpad from "./pages/Launchpad";
import SuperSimple from "./pages/SuperSimple";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <BrowserRouter>
        <div
          className="min-h-screen"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          <Navigation />
          <main
            style={{
              paddingTop: "64px",
              backgroundColor: "blue",
              minHeight: "200px",
              padding: "20px",
            }}
          >
            <Routes>
              <Route path="/" element={<SuperSimple />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/team" element={<Team />} />
              <Route path="/launchpad" element={<Launchpad />} />
              <Route path="/game" element={<GameSimple />} />
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
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
