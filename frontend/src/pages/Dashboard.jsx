import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState("");

  async function loadJobs() {
    setMsg("");
    const res = await client.get("/jobs");
    setJobs(res.data);
  }

  useEffect(() => {
    loadJobs().catch((err) => setMsg(err.response?.data?.message || "Failed to load jobs"));
  }, []);

  async function addJob(payload) {
    await client.post("/jobs", payload);
    await loadJobs();
  }

  async function updateStatus(jobId, status) {
    await client.put(`/jobs/${jobId}`, { status }); // your backend uses PUT
    await loadJobs();
  }

  async function deleteJob(jobId) {
    await client.delete(`/jobs/${jobId}`);
    await loadJobs();
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>AI Job Tracker</h2>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Logged in as <b>{user?.name}</b> ({user?.email})
          </div>
        </div>
        <button onClick={logout} style={{ height: 40 }}>
          Logout
        </button>
      </div>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ marginTop: 20 }}>
        <JobForm onAdd={addJob} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Your Jobs</h3>
        <JobList jobs={jobs} onStatus={updateStatus} onDelete={deleteJob} />
      </div>
    </div>
  );
}
