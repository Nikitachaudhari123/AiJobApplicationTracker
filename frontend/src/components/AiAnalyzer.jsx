import { useState } from "react";
import client from "../api/client";

export default function AiAnalyzer({ onUseResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await client.post("/ai/analyze-job", {
        job_description: text,
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "AI failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-panel">
      <h3>AI Job Analyzer</h3>

      <textarea
        placeholder="Paste full job description here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="ai-result">
          <p><b>Role:</b> {result.role}</p>
          <p><b>Experience:</b> {result.experience}</p>

          <p><b>Skills:</b></p>
          <ul>
            {result.skills.map((s) => <li key={s}>{s}</li>)}
          </ul>

          <p><b>Keywords:</b></p>
          <div className="tags">
            {result.keywords.map((k) => (
              <span key={k} className="tag">{k}</span>
            ))}
          </div>

          <button onClick={() => onUseResult(result)}>
            Use for Job
          </button>
        </div>
      )}
    </div>
  );
}
