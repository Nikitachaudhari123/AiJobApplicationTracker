import { useState } from "react";
import client from "../api/client";
import { Link } from "react-router-dom";

export default function ResumeScore() {
  const [targetRole, setTargetRole] = useState("Junior DBA");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [scoreData, setScoreData] = useState(null);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState("");

  async function runScore() {
    setLoading(true);
    setMsg("");
    setScoreData(null);

    try {
      const res = await client.post("/resume/score", {
        targetRole,
        resumeText,
        jobDescription,
      });

      setScoreData(res.data.data);
      await loadHistory();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to score resume");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    try {
      const res = await client.get("/resume/history");
      setHistory(res.data.data || []);
    } catch (err) {
      // ignore silently
    }
  }

  return (
    <div className="container">
      <div className="header" style={{ marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0 }}>Resume Score</h2>
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            ATS-style scoring + missing keywords + suggestions
          </div>
        </div>

        <Link className="secondary-btn" to="/dashboard" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      {msg && <p style={{ color: "#ef4444" }}>{msg}</p>}

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, opacity: 0.85 }}>Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
              <option>Junior DBA</option>
              <option>Systems Analyst</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 12, opacity: 0.85 }}>Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            style={{ minHeight: 160, resize: "vertical" }}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 12, opacity: 0.85 }}>Job Description (optional)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here (optional)..."
            style={{ minHeight: 140, resize: "vertical" }}
          />
        </div>

        <button
          className="primary-btn"
          onClick={runScore}
          disabled={loading || resumeText.trim().length < 200}
        >
          {loading ? "Scoring..." : "Score My Resume"}
        </button>
      </div>

      {scoreData && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Score: {scoreData.score}/100</h3>

          <div style={{ marginTop: 10 }}>
            <h4 style={{ margin: "10px 0 6px" }}>Suggestions</h4>
            <ul>
              {(scoreData.suggestions || []).slice(0, 8).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 10 }}>
            <h4 style={{ margin: "10px 0 6px" }}>Missing Keywords (top)</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(scoreData.missing_keywords || []).slice(0, 18).map((k) => (
                <span
                  key={k}
                  style={{
                    border: "1px solid #e2e8f0",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 13,
                    opacity: 0.95,
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0 }}>Recent History</h3>
          <button className="secondary-btn" onClick={loadHistory}>Refresh</button>
        </div>

        {history.length === 0 ? (
          <p style={{ opacity: 0.85 }}>No history yet.</p>
        ) : (
          <div style={{ marginTop: 10 }}>
            {history.map((h) => (
              <div key={h.id} style={{ padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                <b>{h.target_role}</b> — Score: <b>{h.score}</b>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(h.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
