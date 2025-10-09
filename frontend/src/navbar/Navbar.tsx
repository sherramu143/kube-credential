import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#1A1A1A",
        color: "#E0E0E0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ fontSize: "1.6rem", fontWeight: "700", color: "#FFFFFF" }}>
        Kube Credential
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <NavLink
          to="/issuance"
          style={({ isActive }) => ({
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: isActive ? "#333" : "transparent",
            color: "#E0E0E0",
            fontWeight: 500,
            transition: "all 0.3s",
          })}
        >
          Issue Credential
        </NavLink>

        <NavLink
          to="/verification"
          style={({ isActive }) => ({
            textDecoration: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: isActive ? "#333" : "transparent",
            color: "#E0E0E0",
            fontWeight: 500,
            transition: "all 0.3s",
          })}
        >
          Verify Credential
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
