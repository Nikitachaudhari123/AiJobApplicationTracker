import { useEffect, useState } from "react";

export default function JobForm({ onAdd, prefill }) {
  const [job_title, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [job_description, setJobDescription] = useState("");

  // extracted arrays
  const [skills, setSkills] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    if (!prefill) return;

    setJobTitle(prefill.role || "");
    setCompany(prefill.company || "");
    

    const autoDesc = [
      "AI Extracted:",
      `Role: ${prefill.role || ""}`,
      `Experience: ${prefill.experience || ""}`,
      `Skills: ${(prefill.skills || []).join(", ")}`,
      `Keywords: ${(prefill.keywords || []).join(", ")}`,
      
    ].join("\n");

    setSkills(Array.isArray(prefill.skills) ? prefill.skills : []);
    setKeywords(Array.isArray(prefill.keywords) ? prefill.keywords : []);
    setJobDescription(autoDesc);
  }, [prefill]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!job_title.trim() || !company.trim()) return;

    await onAdd({
      job_title,
      company,
      job_description,
      skills,
      keywords,
      ai_analysis: prefill || null,
    });

    // clear form after add
    setJobTitle("");
    setCompany("");
    setJobDescription("");
    setSkills([]);
    setKeywords([]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Job</h3>

      <input
        placeholder="Job title"
        value={job_title}
        onChange={(e) => setJobTitle(e.target.value)}
      />

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <textarea
        placeholder="Paste full job description (optional)"
        value={job_description}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {/* optional: show tags (read-only) */}
      {aiAnalysis && (
        <div style={{ marginTop: 12 }}>
          <b>AI Extracted:</b>
          <div>Company: {aiAnalysis.company || "—"}</div>
          <div>Role: {aiAnalysis.role || "—"}</div>
          <div>Experience: {aiAnalysis.experience || "—"}</div>
          <div>Skills: {(aiAnalysis.skills || []).join(", ")}</div>
          <div>Keywords: {(aiAnalysis.keywords || []).join(", ")}</div>
        </div>
      )}

      <button type="submit"> Add Job  </button>
    </form>
  );
}
