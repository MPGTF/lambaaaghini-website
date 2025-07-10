import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./components/WalletProvider";

// Import working navigation
import Navigation from "./components/Navigation";

// Simple working homepage
const Homepage = () => (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0b",
      color: "#fafafa",
      padding: "20px",
      paddingTop: "80px", // Account for fixed navigation
    }}
  >
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "20px",
        margin: "20px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h1>🚀 LAMBAAAGHINI IS LIVE!</h1>
      <p>Welcome to the luxury DeFi ecosystem</p>
    </div>

    {/* Hero Section */}
    <section style={{ padding: "40px 20px", textAlign: "center" }}>
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
        <a
          href="/launchpad"
          style={{
            backgroundColor: "#facc14",
            color: "#0a0a0b",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Launch App →
        </a>
        <a
          href="/whitepaper"
          style={{
            border: "1px solid #a855f7",
            color: "#a855f7",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Read Whitepaper
        </a>
      </div>
    </section>

    {/* Hero Image */}
    <section style={{ textAlign: "center", padding: "40px 20px" }}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F253ce014bfed48a3b74611f6cf44c794%2F3e5641ce2ffe4d8a9ddd24c343aa4978?format=webp&width=800"
        alt="Lambaaaghini - Luxury meets DeFi"
        style={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(250, 204, 20, 0.2)",
        }}
      />
    </section>
  </div>
);

// Simple Game page
const GamePage = () => (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0b",
      color: "#fafafa",
      padding: "20px",
      paddingTop: "80px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#facc14",
        color: "#0a0a0b",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h1>🐑💨 LAMB DEFENSE FORCE</h1>
      <p>Professional Galactic Defense Simulator</p>
    </div>
    <p style={{ fontSize: "18px", marginBottom: "20px" }}>
      Defend the Solana ecosystem against incoming zombie threats!
    </p>
    <div
      style={{
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        border: "2px solid #a855f7",
        borderRadius: "8px",
        padding: "40px",
        fontSize: "16px",
      }}
    >
      Game coming soon... Loading fart-powered defense systems 💨
    </div>
  </div>
);

// Simple pages for other routes
const SimplePage = ({ title, emoji }: { title: string; emoji: string }) => (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0b",
      color: "#fafafa",
      padding: "20px",
      paddingTop: "80px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#a855f7",
        color: "white",
        padding: "40px",
        borderRadius: "8px",
        fontSize: "24px",
      }}
    >
      {emoji} {title}
    </div>
    <p style={{ marginTop: "20px", fontSize: "18px", opacity: 0.8 }}>
      Welcome to the {title} section of Lambaaaghini
    </p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <BrowserRouter>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/game" element={<GamePage />} />
            <Route
              path="/launchpad"
              element={<SimplePage title="Launchpad" emoji="🚀" />}
            />
            <Route
              path="/roadmap"
              element={<SimplePage title="Roadmap" emoji="🗺️" />}
            />
            <Route
              path="/whitepaper"
              element={<SimplePage title="Whitepaper" emoji="📄" />}
            />
            <Route
              path="/team"
              element={<SimplePage title="Team" emoji="👥" />}
            />
            <Route
              path="*"
              element={
                <div
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    padding: "40px",
                    margin: "20px",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginTop: "100px",
                  }}
                >
                  <h1>🐑 404 - Page Not Found</h1>
                  <p>Return to the herd!</p>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </WalletProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
