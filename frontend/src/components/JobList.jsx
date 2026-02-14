export default function JobList({ jobs = [], onStatus, onDelete }) {
  const statuses = ["applied", "interview", "offer", "rejected"];
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (safeJobs.length === 0) return <p>No jobs yet.</p>;

  return (
    <div className="job-list">
      {safeJobs.map((job) => (
        <div key={job.id} className="job-item">
          <div className="job-left">
            <div className="job-title">
              <span className="job-role">{job.job_title}</span>
              <span className="job-at"> @ </span>
              <span className="job-company">{job.company}</span>
            </div>

            <div className="job-meta">
              <span className="muted">Status:</span>{" "}
              <span className="status-pill">{job.status}</span>
            </div>

            {job.job_description ? (
              <div className="job-desc">{job.job_description}</div>
            ) : null}
          </div>

          <div className="job-right">
            <select
              className="job-select"
              value={job.status}
              onChange={(e) => onStatus?.(job.id, e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button className="danger-btn" onClick={() => onDelete?.(job.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
