export default function JobList({ jobs, onStatus, onDelete }) {
  const statuses = ["applied", "interview", "rejected", "offer"];

  if (!jobs.length) return <p>No jobs yet.</p>;

  return (
    <div>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{job.job_title}</b> @ {job.company}
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Status: <b>{job.status}</b>
              </div>
            </div>
            <button onClick={() => onDelete(job.id)}>Delete</button>
          </div>

          <div style={{ marginTop: 10 }}>
            <select value={job.status} onChange={(e) => onStatus(job.id, e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {job.job_description && <p style={{ marginTop: 10 }}>{job.job_description}</p>}
        </div>
      ))}
    </div>
  );
}
