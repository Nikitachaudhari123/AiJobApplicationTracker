const pool = require("../config/db");

// CREATE job application
async function createJob(req, res) {
  try {
    const { job_title, company, job_description } = req.body;
    const userId = req.user.id;

    if (!job_title || !company) {
      return res.status(400).json({ message: "Job title and company required" });
    }

    await pool.query(
      `INSERT INTO job_applications 
       (user_id, job_title, company, job_description)
       VALUES (?, ?, ?, ?)`,
      [userId, job_title, company, job_description]
    );

    res.status(201).json({ message: "Job application created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET all jobs for logged-in user
async function getJobs(req, res) {
  try {
    const userId = req.user.id;

    const [jobs] = await pool.query(
      "SELECT * FROM job_applications WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createJob, getJobs };
