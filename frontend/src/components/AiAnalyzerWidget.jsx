import { useState } from "react";
import client from "../api/client";

export default function AiAnalyzerWidget({ onApplyToForm }) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  async function analyze() {
    try {
      setLoading(true);
      setErr("");
      setData(null);

      const res = await client.post("/ai/analyze-job", { job_description: text });
      setData(res.data.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Analyze failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button className="ai-fab" onClick={() => setOpen(true)}>
        🤖 AI
      </button>
    );
  }

  return (
    <div className="ai-widget">
      <div className="ai-head">
        <div>
          <b>AI Job Analyzer</b>
          <div style={{margin: 12, fontSize: 12, opacity: 0.75 }}>
            Paste job description → extract role, skills, keywords.
          </div>
        </div>
        <button className="ai-close" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste job description here..."
        rows={8}
      />

      <button className="primary-btn" onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {err && <div style={{ marginTop: 8, color: "#ef4444" }}>{err}</div>}

      {data && (
        <div style={{ marginTop: 10 }}>
          <div><b>Role:</b> {data.role}</div>
          <div style={{ marginTop: 6 }}><b>Experience:</b> {data.experience}</div>
      {data?.company && (
          <div style={{ marginTop: 6 }}>
          <b>Company:</b> {data.company}
             </div>
            )}
          <div style={{ marginTop: 10 }}>
            <b>Skills:</b>
            <ul>
              {(data.skills || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 8 }}>
            <b>Keywords:</b>{" "}
            {(data.keywords || []).map((k, i) => (
              <span key={i} className="tag">
                {k}
              </span>
            ))}
          </div>

          <button
            className="secondary-btn"
            style={{ marginTop: 10 }}
            onClick={() => onApplyToForm?.(data)}
          >
            Use for Job
          </button>
        </div>
      )}
    </div>
  );
}
