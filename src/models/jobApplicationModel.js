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
async function getAllJobApplications({
  user_id,
  page = 1,
  limit = 10,
  status,
  company,
}) {
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, job_title, company, status, job_description, created_at
    FROM job_applications
    WHERE user_id = ?
  `;
  const params = [user_id];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (company) {
    query += " AND company LIKE ?";
    params.push(`%${company}%`);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.query(query, params);
  return rows;
}

// UPDATE job status (ownership)
async function updateJobStatus(id, user_id, status) {
  const [result] = await pool.query(
    `UPDATE job_applications
     SET status = ?
     WHERE id = ? AND user_id = ?`,
    [status, id, user_id]
  );
  return result.affectedRows;
}

// DELETE job (ownership)
async function deleteJobApplication(id, user_id) {
  const [result] = await pool.query(
    `DELETE FROM job_applications
     WHERE id = ? AND user_id = ?`,
    [id, user_id]
  );
  return result.affectedRows;
}

// GET single job (ownership)
async function getJobApplicationById(id, user_id) {
  const [rows] = await pool.query(
    `SELECT id, job_title, company, status, job_description, created_at
     FROM job_applications
     WHERE id = ? AND user_id = ?`,
    [id, user_id]
  );

  return rows[0] || null;
}

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  updateJobStatus,
  deleteJobApplication,
};
