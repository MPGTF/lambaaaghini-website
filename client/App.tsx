<<<<<<< HEAD
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletProvider from "./components/WalletProvider";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Launchpad from "./pages/Launchpad";
import Game from "./pages/Game";
import BarrioGame from "./pages/BarrioGame";
import Roadmap from "./pages/Roadmap";
import Whitepaper from "./pages/Whitepaper";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
=======
import "./simple.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./components/WalletProvider";
>>>>>>> 5e875c3d8135b83666df6a23b08ec2b233870669

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/launchpad" element={<Launchpad />} />
                <Route path="/game" element={<Game />} />
                <Route path="/barrio" element={<BarrioGame />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/team" element={<Team />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
=======
    <WalletProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        {/* Navigation */}
        <nav
          style={{
            position: "fixed",
            top: "0",
            width: "100%",
            backgroundColor: "rgba(9, 9, 11, 0.9)",
            borderBottom: "1px solid rgba(39, 39, 42, 0.5)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "64px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#facc14",
                }}
              >
                LAMBAAAGHINI
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "32px" }}
              >
                <a
                  href="#"
                  style={{ color: "#facc14", textDecoration: "none" }}
                >
                  Home
                </a>
                <a
                  href="#about"
                  style={{ color: "#a1a1aa", textDecoration: "none" }}
                >
                  About
                </a>
                <a
                  href="#roadmap"
                  style={{ color: "#a1a1aa", textDecoration: "none" }}
                >
                  Roadmap
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main
          style={{
            paddingTop: "64px",
            minHeight: "100vh",
          }}
        >
          {/* Hero Section */}
          <section
            style={{
              padding: "80px 20px",
              textAlign: "center",
              backgroundColor: "#0a0a0b",
            }}
          >
            <div
              style={{
                backgroundColor: "#ff0000",
                color: "#ffffff",
                padding: "20px",
                margin: "20px auto",
                borderRadius: "8px",
                maxWidth: "600px",
              }}
            >
              <h1 style={{ color: "#ffffff", margin: "0 0 10px 0" }}>
                🚀 LAMBAAAGHINI IS LIVE!
              </h1>
              <p style={{ color: "#ffffff", margin: "0" }}>
                Welcome to the luxury DeFi ecosystem
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#facc14",
                color: "#000000",
                padding: "8px 16px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "32px",
              }}
            >
              🏎️ The Future of Luxury DeFi
            </div>

            <h1
              style={{
                fontSize: "4rem",
                fontWeight: "bold",
                marginBottom: "32px",
                color: "#facc14",
              }}
            >
              LAMBAAAGHINI
            </h1>

            <p
              style={{
                fontSize: "1.25rem",
                marginBottom: "48px",
                maxWidth: "600px",
                margin: "0 auto 48px auto",
                color: "#ffffff",
              }}
            >
              Experience the pinnacle of luxury in the Solana ecosystem.
              High-performance DeFi protocols engineered for speed, style, and
              unprecedented returns.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  backgroundColor: "#facc14",
                  color: "#000000",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Launch App →
              </button>
              <button
                style={{
                  border: "2px solid #a855f7",
                  backgroundColor: "#a855f7",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Read Whitepaper
              </button>
            </div>
          </section>

          {/* Features Section */}
          <section
            style={{
              padding: "80px 20px",
              backgroundColor: "#111111",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "48px",
              }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  color: "#ffffff",
                }}
              >
                <span style={{ color: "#facc14" }}>Professional</span>{" "}
                <span style={{ color: "#a855f7" }}>Features</span>
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                  color: "#ffffff",
                }}
              >
                Industry-leading DeFi technology with enterprise-grade
                capabilities.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(250, 204, 20, 0.1)",
                  border: "1px solid rgba(250, 204, 20, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏎️</div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#facc14",
                    marginBottom: "12px",
                  }}
                >
                  Lambo-Speed Transactions
                </h3>
                <p style={{ color: "#ffffff" }}>
                  Execute trades faster than your cousin's Honda Civic with our
                  revolutionary Solana integration.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛡️</div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#a855f7",
                    marginBottom: "12px",
                  }}
                >
                  Fort Knox Security
                </h3>
                <p style={{ color: "#ffffff" }}>
                  Military-grade security protocols that are tighter than your
                  pants after Thanksgiving dinner.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(250, 204, 20, 0.1)",
                  border: "1px solid rgba(250, 204, 20, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💰</div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#facc14",
                    marginBottom: "12px",
                  }}
                >
                  Money Printer Go Brrr
                </h3>
                <p style={{ color: "#ffffff" }}>
                  Generate yields so high they might be illegal in several
                  countries.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section
            style={{
              padding: "80px 20px",
              backgroundColor: "#0a0a0b",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "32px",
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#333",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#facc14",
                    marginBottom: "8px",
                  }}
                >
                  🚀 Moon
                </div>
                <div style={{ fontSize: "14px", color: "#ffffff" }}>
                  Trajectory Status
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#333",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#a855f7",
                    marginBottom: "8px",
                  }}
                >
                  🐑 25K+
                </div>
                <div style={{ fontSize: "14px", color: "#ffffff" }}>
                  Lambs in the Herd
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#333",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#facc14",
                    marginBottom: "8px",
                  }}
                >
                  🏎️ Fast
                </div>
                <div style={{ fontSize: "14px", color: "#ffffff" }}>
                  Lambo Speed
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#333",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#a855f7",
                    marginBottom: "8px",
                  }}
                >
                  💎 Hodl
                </div>
                <div style={{ fontSize: "14px", color: "#ffffff" }}>
                  Diamond Hands
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer
            style={{
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "#111111",
              borderTop: "1px solid rgba(39, 39, 42, 0.5)",
            }}
          >
            <p style={{ color: "#ffffff" }}>
              © 2024 Lambaaaghini. Built on Solana. 🐑💨
            </p>
          </footer>
        </main>
      </div>
    </WalletProvider>
>>>>>>> 5e875c3d8135b83666df6a23b08ec2b233870669
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
