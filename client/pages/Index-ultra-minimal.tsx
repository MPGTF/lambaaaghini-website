import { Link } from "react-router-dom";

export default function IndexUltraMinimal() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0b",
        color: "#fafafa",
        padding: "20px",
        paddingTop: "80px", // Account for fixed navigation
      }}
    >
      {/* Test Section */}
      <div
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "20px",
          margin: "20px",
          borderRadius: "8px",
        }}
      >
        <h1>🐑 ULTRA MINIMAL INDEX TEST</h1>
        <p>This uses ZERO external UI components</p>
        <p>If you see this, the basic React structure works!</p>
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
          <Link
            to="/launchpad"
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
          </Link>
          <Link
            to="/whitepaper"
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
          </Link>
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

      {/* Stats Section */}
      <section style={{ padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center" }}>
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
          <div style={{ textAlign: "center" }}>
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
          <div style={{ textAlign: "center" }}>
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
          <div style={{ textAlign: "center" }}>
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

      {/* Features Section */}
      <section style={{ padding: "40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "#facc14" }}>Professional</span>{" "}
            <span style={{ color: "#a855f7" }}>Features</span>
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              opacity: 0.8,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Industry-leading agricultural simulation technology with
            enterprise-grade sheep management capabilities.
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
            <p style={{ opacity: 0.8 }}>
              Execute trades faster than your cousin's Honda Civic with our
              revolutionary Solana integration that definitely isn't slow.
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
              Fort Knox for Sheep
            </h3>
            <p style={{ opacity: 0.8 }}>
              Military-grade security protocols that are tighter than your pants
              after Thanksgiving dinner. Your lambs are safe with us.
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
            <p style={{ opacity: 0.8 }}>
              Generate yields so high they might be illegal in several
              countries. Our ROI calculator needs scientific notation.
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <div
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "20px",
          margin: "40px 20px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2>🎉 SUCCESS! 🎉</h2>
        <p>If you see this entire page, your app is working!</p>
        <p>The issue was with UI components (Button, Card, Badge, etc.)</p>
      </div>
    </div>
  );
}
