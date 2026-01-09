export default function JobList({ jobs = [], onStatus, onDelete }) {
  const statuses = ["applied", "interview", "offer", "rejected"];

  if (jobs.length === 0) return <p>No jobs yet.</p>;

  return (
    <>
      {jobs.map((job) => (
        <div key={job.id} className="job-card card">
          <b>{job.job_title}</b> @ {job.company}
          <div>Status: {job.status}</div>

          <select
            value={job.status}
            onChange={(e) => onStatus(job.id, e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            className="danger-btn"
            onClick={() => onDelete(job.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
