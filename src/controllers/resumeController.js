// src/controllers/resumeController.js
const pool = require("../config/db");
const { scoreResume } = require("../utils/resumeScorer");

async function createResumeScore(req, res) {
  try {
    const userId = req.user.id; // { id, email } from JWT middleware :contentReference[oaicite:2]{index=2}
    const { targetRole, resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 200) {
      return res.status(400).json({ message: "Resume text is too short. Paste your resume content." });
    }

    const result = scoreResume({
      resumeText,
      jobDescription: jobDescription || "",
      targetRole: targetRole || "Junior DBA",
    });

    await pool.query(
      `INSERT INTO resume_scores
        (user_id, target_role, resume_text, job_description, score, matched_keywords, missing_keywords, suggestions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        targetRole || "Junior DBA",
        resumeText,
        jobDescription || null,
        result.score,
        JSON.stringify(result.matched_keywords),
        JSON.stringify(result.missing_keywords),
        JSON.stringify(result.suggestions),
      ]
    );

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getResumeScoreHistory(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, target_role, score, created_at
       FROM resume_scores
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createResumeScore, getResumeScoreHistory };
