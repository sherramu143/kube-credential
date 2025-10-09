import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#2C3E50", marginBottom: "1rem" }}>
        Welcome to Kube Credential
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#34495E", marginBottom: "2rem" }}>
        Easily issue and verify credentials with a few clicks
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/issuance")}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#F1C40F",
            border: "none",
            borderRadius: "8px",
            color: "#2C3E50",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Issue Credential
        </button>

        <button
          onClick={() => navigate("/verification")}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#3498DB",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Verify Credential
        </button>
      </div>
    </div>
  );
};

export default HomePage;
