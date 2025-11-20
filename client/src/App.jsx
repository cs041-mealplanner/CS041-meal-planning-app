import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("http://localhost:3001/health");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setStatus(data.status ?? "unknown");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setError(err.message || "Unknown error");
      }
    }

    fetchHealth();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-primary)",   // ivory background
        color: "var(--text-dark)",
        padding: "2rem"
      }}
    >
      {/* CARD CONTAINER */}
      <div
        style={{
          background: "var(--bg-secondary)", // warm sand
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "550px",
          textAlign: "center",
        }}
      >
        {/* INNER CONTENT */}
        <h1
          style={{
            fontSize: "2.2rem",
            marginBottom: "1rem",
            fontWeight: 600,
            color: "var(--primary-green)", // sage green highlight
          }}
        >
          Nourishly – React + Express Skeleton
        </h1>

        <p style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
          API health status:{" "}
          <strong style={{ color: "var(--primary-green)" }}>
            {status}
          </strong>
        </p>

        {error && (
          <p style={{ color: "#d97706", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Error talking to API: {error}
          </p>
        )}

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.85rem",
            opacity: 0.7,
          }}
        >
          Client: Vite + React • Server: Express (port 3001)
        </p>
      </div>
    </div>
  );
}

export default App;
