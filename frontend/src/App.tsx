import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import HomePage from "./pages/HomePage";
import IssuancePage from "./pages/IssuancePage";
import VerificationPage from "./pages/VerificationPage";

const App: React.FC = () => {
  return (
    <HashRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f5f5f5" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/issuance" element={<IssuancePage />} />
            <Route path="/verification" element={<VerificationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
