import { useState } from "react";

export default function JobForm({ onAdd }) {
  const [job_title, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [job_description, setJobDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await onAdd({ job_title, company, job_description });
    setJobTitle("");
    setCompany("");
    setJobDescription("");
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <h3>Add Job</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Job title"
          value={job_title}
          onChange={(e) => setJobTitle(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <textarea
          placeholder="Job description (optional)"
          value={job_description}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, height: 80 }}
        />
        <button style={{ padding: 10 }}>Add</button>
      </form>
    </div>
  );
}
