const pool = require("../config/db");

async function addStatusHistory({
  job_application_id,
  old_status,
  new_status,
}) {
  await pool.query(
    `INSERT INTO application_status_history
     (job_application_id, old_status, new_status)
     VALUES (?, ?, ?)`,
    [job_application_id, old_status, new_status]
  );
}

async function getStatusHistory(job_application_id) {
  const [rows] = await pool.query(
    `SELECT old_status, new_status, changed_at
     FROM application_status_history
     WHERE job_application_id = ?
     ORDER BY changed_at DESC`,
    [job_application_id]
  );
  return rows;
}

module.exports = { addStatusHistory, getStatusHistory };
