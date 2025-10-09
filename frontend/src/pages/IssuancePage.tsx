import React, { useState } from "react";
import axios from "axios";

const IssuancePage: React.FC = () => {
  const [inputJson, setInputJson] = useState("");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<{ code: number; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputJson) return alert("Please enter credential JSON!");
    try {
      const parsed = JSON.parse(inputJson);
      setLoading(true);
      setResult(null);
      setStatus(null);

      const res = await axios.post("https://kube-credential-issuance-19fc.onrender.com/issue", parsed);
      setResult(res.data);
      setStatus({ code: 200, message: "Success" });
    } catch (err) {
      setResult({ error: "Error issuing credential. Check your JSON or server." });
      setStatus({ code: 400, message: "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        
        backgroundColor: "#0d1117",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Fira Code', monospace",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#161B22",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: result ? "row" : "column",
          gap: "1.5rem",
          overflow: "hidden",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            flex: result ? 1 : 1,
            transition: "flex 0.4s ease",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h4 style={{ color: "#C9D1D9" }}>Request JSON</h4>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder='{"name": "John Doe", "credential_type": "student_id"}'
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #30363D",
              backgroundColor: "#0d1117",
              color: "#E6EDF3",
              fontFamily: "'Fira Code', monospace",
              fontSize: "0.95rem",
              resize: "none",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.75rem",
              backgroundColor: loading ? "#21262D" : "#238636",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s",
            }}
          >
            {loading ? "Issuing..." : "🚀 Issue Credential"}
          </button>
        </div>

        {/* Right Panel */}
        {result && (
          <div
            style={{
              flex: 1,
              backgroundColor: "#0d1117",
              borderRadius: "10px",
              padding: "1rem",
              border: "1px solid #30363D",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              minHeight: "250px",
              transition: "flex 0.4s ease",
            }}
          >
            <h4 style={{ color: "#C9D1D9" }}>Response</h4>
            {status && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.8rem",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                }}
              >
                <span
                  style={{
                    backgroundColor: status.code === 200 ? "#2EA043" : "#F85149",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "6px",
                    color: "#FFF",
                    marginRight: "0.6rem",
                  }}
                >
                  {status.code}
                </span>
                                <p style={{ color: status.code === 200 ? "#2EA043" : "#F85149" }}>
    {status.message}
  </p>
              </div>
            )}
            <pre
              style={{
                margin: 0,
                padding: "1rem",
                backgroundColor: "#161B22",
                borderRadius: "6px",
                border: "1px solid #30363D",
                color: "#A5D6FF",
                whiteSpace: "pre-wrap",
                flex: 1,
                overflow: "hidden",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuancePage;
