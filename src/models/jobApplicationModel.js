// src/models/jobApplicationModel.js
const pool = require('../config/db');

async function createJobApplication({ job_title, company, status, job_description }) {
  const [result] = await pool.query(
    `INSERT INTO job_applications (job_title, company, status, job_description)
     VALUES (?, ?, ?, ?)`,
    [job_title, company, status, job_description || null]
  );

  return result.insertId;
}

async function getAllJobApplications() {
  const [rows] = await pool.query(
    `SELECT id, job_title, company, status, job_description, created_at
     FROM job_applications
     ORDER BY created_at DESC`
  );
  return rows;
}

async function getJobApplicationById(id) {
  const [rows] = await pool.query(
    `SELECT id, job_title, company, status, job_description, created_at
     FROM job_applications
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function updateJobStatus(id, status) {
  const [result] = await pool.query(
    `UPDATE job_applications
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows; // 0 if not found
}

async function deleteJobApplication(id) {
  const [result] = await pool.query(
    `DELETE FROM job_applications
     WHERE id = ?`,
    [id]
  );
  return result.affectedRows; // 0 if not found
}

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  updateJobStatus,
  deleteJobApplication,
};
