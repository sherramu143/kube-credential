import React, { useState } from "react";
import { verifyCredential } from "../api/api";

const VerificationPage: React.FC = () => {
  const [inputData, setInputData] = useState("");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<{ code: number; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!inputData) return alert("Please enter credential JSON!");
    try {
      const parsedData = JSON.parse(inputData);
      setLoading(true);
      setStatus(null);
      setResult(null);

      const res = await verifyCredential(parsedData);
      setResult(res);
      setStatus({ code: 200, message: "OK" });
    } catch (err: any) {
      setStatus({ code: 400, message: "Bad Request" });
      setResult({ error: "Error verifying credential. Ensure JSON is valid." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "1rem auto",
        padding: "1rem",
        borderRadius: "12px",
        backgroundColor: "#0d1117",
        color: "#E6EDF3",
        fontFamily: "'Fira Code', monospace",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#58A6FF",
          letterSpacing: "1px",
          marginBottom: "1.5rem",
          fontSize: "1.4rem",
        }}
      >
        Verify Credentials
      </h2>

      {/* Responsive Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: result ? "1fr 1fr" : "1fr",
          gap: "1rem",
          transition: "all 0.4s ease",
          width: "100%",
        }}
      >
        {/* Request Panel */}
        <div
          style={{
            backgroundColor: "#161B22",
            borderRadius: "10px",
            padding: "1rem",
            border: "1px solid #30363D",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "400px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h4 style={{ color: "#C9D1D9", marginBottom: "0.8rem" }}>
              Request Body (JSON)
            </h4>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={10}
              placeholder='{"credential_id": "8862103d-dc56-4d1b-92b6-4a551fae7e2a"}'
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #30363D",
                backgroundColor: "#0d1117",
                color: "#E6EDF3",
                fontSize: "0.9rem",
                resize: "none",
                fontFamily: "'Fira Code', monospace",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "1rem",
              backgroundColor: loading ? "#21262D" : "#238636",
              color: "#FFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              boxSizing: "border-box",
            }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {/* Response Panel - Show only after verification */}
        {result && (
          <div
            style={{
              backgroundColor: "#161B22",
              borderRadius: "10px",
              padding: "1rem",
              border: "1px solid #30363D",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: "400px",
              boxSizing: "border-box",
            }}
          >
            <h4 style={{ color: "#C9D1D9", marginBottom: "0.8rem" }}>Response</h4>

            {/* Status */}
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
                    backgroundColor: status?.code === 200 ? "#2EA043" : "#F85149",
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
                flex: 1,
                padding: "1rem",
                backgroundColor: "#0d1117",
                borderRadius: "6px",
                border: "1px solid #30363D",
                color: "#A5D6FF",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxSizing: "border-box",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Mobile responsiveness */}
      <style>
        {`
          @media (max-width: 1024px) {
            h2 {
              font-size: 1.2rem !important;
            }
            textarea {
              font-size: 0.85rem !important;
            }
          }

          @media (max-width: 768px) {
            div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }

            div[style*="padding: 1rem"] {
              padding: 0.8rem !important;
            }

            textarea, pre {
              font-size: 0.8rem !important;
            }
          }

          @media (max-width: 480px) {
            h2 {
              font-size: 1rem !important;
            }
            button {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VerificationPage;
