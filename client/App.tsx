import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
// import Index from "./pages/Index";  // ← Start with this disabled
// import Launchpad from "./pages/Launchpad";  // ← Complex AI/wallet stuff
// import Game from "./pages/Game";  // ← Complex game logic
// import BarrioGame from "./pages/BarrioGame";  // ← Complex game logic

const App = () => (
  <BrowserRouter>
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <Navigation />
      <main style={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/game" element={<TestGame />} />
          <Route path="/launchpad" element={<TestGame />} />
          <Route path="/barrio" element={<TestGame />} />
          <Route path="/roadmap" element={<TestGame />} />
          <Route path="/whitepaper" element={<TestGame />} />
          <Route path="/team" element={<TestGame />} />
          <Route path="*" element={<TestHome />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
