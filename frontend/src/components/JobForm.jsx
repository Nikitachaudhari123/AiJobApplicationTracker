import { useState } from "react";

export default function JobForm({ onAdd }) {
  const [job_title, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [job_description, setJobDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!job_title || !company) return;
    await onAdd({ job_title, company, job_description });
    setJobTitle("");
    setCompany("");
    setJobDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Job</h3>
      <input placeholder="Job title" value={job_title}
        onChange={(e) => setJobTitle(e.target.value)} />
      <input placeholder="Company" value={company}
        onChange={(e) => setCompany(e.target.value)} />
      <textarea placeholder="Job description"
        value={job_description}
        onChange={(e) => setJobDescription(e.target.value)} />
      <button className="primary-btn">Add Job</button>
    </form>
  );
}
