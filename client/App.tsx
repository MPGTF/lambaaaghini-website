import "./simple.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./components/WalletProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                  color: "#facc14", // FORCE YELLOW COLOR
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
                  href="#game"
                  style={{ color: "#a1a1aa", textDecoration: "none" }}
                >
                  Lamb Defense
                </a>
                <a
                  href="#about"
                  style={{ color: "#a1a1aa", textDecoration: "none" }}
                >
                  About
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
                backgroundColor: "#ff0000", // BRIGHT RED
                color: "#ffffff", // FORCE WHITE TEXT
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
                backgroundColor: "#facc14", // BRIGHT YELLOW
                color: "#000000", // FORCE BLACK TEXT
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
                color: "#facc14", // FORCE YELLOW - NO GRADIENT
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
                color: "#ffffff", // FORCE WHITE TEXT
                opacity: 1, // REMOVE OPACITY
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
                  color: "#000000", // FORCE BLACK TEXT
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
                  backgroundColor: "#a855f7", // SOLID PURPLE BACKGROUND
                  color: "#ffffff", // FORCE WHITE TEXT
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

          {/* Game Section */}
          <section
            id="game"
            style={{
              padding: "80px 20px",
              textAlign: "center",
              backgroundColor: "#111111",
            }}
          >
            <div
              style={{
                backgroundColor: "#facc14", // BRIGHT YELLOW
                color: "#000000", // FORCE BLACK TEXT
                padding: "40px",
                borderRadius: "8px",
                marginBottom: "20px",
                maxWidth: "800px",
                margin: "0 auto 20px auto",
              }}
            >
              <h2
                style={{
                  fontSize: "2rem",
                  marginBottom: "16px",
                  color: "#000000",
                }}
              >
                🐑💨 LAMB DEFENSE FORCE
              </h2>
              <p style={{ fontSize: "18px", color: "#000000" }}>
                Professional Galactic Defense Simulator
              </p>
            </div>
            <p
              style={{
                fontSize: "18px",
                marginBottom: "20px",
                color: "#ffffff", // FORCE WHITE
              }}
            >
              Defend the Solana ecosystem against incoming zombie threats!
            </p>
            <div
              style={{
                backgroundColor: "#a855f7", // SOLID PURPLE
                border: "2px solid #ffffff",
                borderRadius: "8px",
                padding: "40px",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto",
                color: "#ffffff", // FORCE WHITE TEXT
              }}
            >
              Game coming soon... Loading fart-powered defense systems 💨
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
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
