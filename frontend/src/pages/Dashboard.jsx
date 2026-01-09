import { useAuth } from "../auth/AuthContext";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const {
    user,
    logout,
    jobs,
    addJob,
    updateStatus,
    deleteJob,
    page,
    setPage,
    hasNext,
    msg,
    dark,
    setDark,
  } = useAuth();

  return (
    <div className="container">
      <div className="header">
        <button
          className="secondary-btn"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <div>
          <h2>AI Job Tracker</h2>
          <div style={{ fontSize: 14 }}>
            Logged in as <b>{user?.name}</b> ({user?.email})
          </div>
        </div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {msg && <p style={{ color: "#ef4444" }}>{msg}</p>}

      <div className="card">
        <JobForm onAdd={addJob} />
      </div>

      <div className="card">
        <h3>Your Jobs</h3>
        <JobList
          jobs={jobs}
          onStatus={updateStatus}
          onDelete={deleteJob}
        />

        <div className="pagination">
          <button
            className="secondary-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            className="secondary-btn"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}