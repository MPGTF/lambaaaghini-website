import "./global.css";
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
            backgroundColor: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(12px)",
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
                  background:
                    "linear-gradient(135deg, #facc14 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
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
                backgroundColor: "red",
                color: "white",
                padding: "20px",
                margin: "20px auto",
                borderRadius: "8px",
                maxWidth: "600px",
              }}
            >
              <h1>🚀 LAMBAAAGHINI IS LIVE!</h1>
              <p>Welcome to the luxury DeFi ecosystem</p>
            </div>

            <div
              style={{
                backgroundColor: "#facc14",
                color: "#0a0a0b",
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
                background: "linear-gradient(135deg, #facc14 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
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
                opacity: 0.8,
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
                  color: "#0a0a0b",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Launch App →
              </button>
              <button
                style={{
                  border: "1px solid #a855f7",
                  backgroundColor: "transparent",
                  color: "#a855f7",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
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
              backgroundColor: "#111",
            }}
          >
            <div
              style={{
                backgroundColor: "#facc14",
                color: "#0a0a0b",
                padding: "40px",
                borderRadius: "8px",
                marginBottom: "20px",
                maxWidth: "800px",
                margin: "0 auto 20px auto",
              }}
            >
              <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>
                🐑💨 LAMB DEFENSE FORCE
              </h2>
              <p style={{ fontSize: "18px" }}>
                Professional Galactic Defense Simulator
              </p>
            </div>
            <p style={{ fontSize: "18px", marginBottom: "20px", opacity: 0.8 }}>
              Defend the Solana ecosystem against incoming zombie threats!
            </p>
            <div
              style={{
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                border: "2px solid #a855f7",
                borderRadius: "8px",
                padding: "40px",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto",
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
              <div>
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
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Trajectory Status
                </div>
              </div>
              <div>
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
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Lambs in the Herd
                </div>
              </div>
              <div>
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
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                  Lambo Speed
                </div>
              </div>
              <div>
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
                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
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
              backgroundColor: "#111",
              borderTop: "1px solid rgba(39, 39, 42, 0.5)",
            }}
          >
            <p style={{ opacity: 0.7 }}>
              © 2024 Lambaaaghini. Built on Solana. 🐑💨
            </p>
          </footer>
        </main>
      </div>
    </WalletProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
