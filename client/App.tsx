import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test components
const TestHome = () => (
  <div
    style={{
      backgroundColor: "red",
      color: "white",
      padding: "20px",
      margin: "20px",
    }}
  >
    <h1>🐑 TEST HOME PAGE - WORKING!</h1>
    <p>If you see this, React Router is working!</p>
    <p>Navigation should be above this.</p>
  </div>
);

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
    <p>React Router successfully navigated to /game</p>
  </div>
);

// Import working navigation
import Navigation from "./components/Navigation";

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
