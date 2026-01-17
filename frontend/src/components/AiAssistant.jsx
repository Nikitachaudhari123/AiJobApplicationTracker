import { useState } from "react";
import client from "../api/client";

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  async function analyze() {
    setErr("");
    setResult(null);

    if (!text.trim()) return setErr("Paste a job description first.");

    setLoading(true);
    try {
      const res = await client.post("/ai/analyze-job", {
        job_description: text,
      });
      setResult(res.data.data);
    } catch (e) {
      setErr(e.response?.data?.message || "AI analyze failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid #334155",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          🤖 AI
        </button>
      ) : (
        <div
          style={{
            width: 380,
            height: 500,
            borderRadius: 14,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <b>AI Job Analyzer</b>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#cbd5e1",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 12, flex: 1, overflow: "auto" }}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
              Paste a job description → extract role, skills, keywords.
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste job description here..."
              style={{
                width: "100%",
                height: 170,
                resize: "vertical",
                background: "#0f172a",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: 10,
                outline: "none",
              }}
            />

            <button
              onClick={analyze}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                border: "1px solid #4338ca",
                background: loading ? "#1f2937" : "#4f46e5",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {err && (
              <div style={{ marginTop: 10, color: "#f87171", fontSize: 13 }}>
                {err}
              </div>
            )}

            {result && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <div style={{ marginBottom: 8 }}>
                  <b>Role:</b> {result.role}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <b>Experience:</b> {result.experience}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <b>Skills:</b>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                    {(result.skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "#111827",
                          border: "1px solid #334155",
                          fontSize: 12,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <b>Keywords:</b>
                  <ul style={{ margin: "6px 0 0 18px" }}>
                    {(result.keywords || []).map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
