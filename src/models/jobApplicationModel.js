const pool = require("../config/db");

// CREATE job (user-scoped)
async function createJobApplication({
  user_id,
  job_title,
  company,
  status = "applied",
  job_description,
}) {
  const [result] = await pool.query(
    `INSERT INTO job_applications 
     (user_id, job_title, company, status, job_description)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, job_title, company, status, job_description || null]
  );

  return result.insertId;
}

// GET all jobs for a user
async function getAllJobApplications(user_id) {
  const [rows] = await pool.query(
    `SELECT id, job_title, company, status, job_description, created_at
     FROM job_applications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
}

// UPDATE job status (ownership enforced)
async function updateJobStatus(id, user_id, status) {
  const [result] = await pool.query(
    `UPDATE job_applications
     SET status = ?
     WHERE id = ? AND user_id = ?`,
    [status, id, user_id]
  );
  return result.affectedRows;
}

// DELETE job (ownership enforced)
async function deleteJobApplication(id, user_id) {
  const [result] = await pool.query(
    `DELETE FROM job_applications
     WHERE id = ? AND user_id = ?`,
    [id, user_id]
  );
  return result.affectedRows;
}

module.exports = {
  createJobApplication,
  getAllJobApplications,
  updateJobStatus,
  deleteJobApplication,
};
