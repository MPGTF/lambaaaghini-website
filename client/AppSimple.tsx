import "./global.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./components/WalletProvider";

const queryClient = new QueryClient();

const SimpleApp = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "40px",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          🔴 SIMPLE APP TEST - NO ROUTING
        </div>
        <div
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "20px",
            marginTop: "20px",
            fontSize: "18px",
          }}
        >
          ✅ If you see this, React is working!
        </div>
        <div
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          🌐 Navigation would go here
        </div>
      </div>
    </WalletProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<SimpleApp />);
