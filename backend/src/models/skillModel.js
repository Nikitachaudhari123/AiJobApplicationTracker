const pool = require("../config/db");

async function getOrCreateSkill(name) {
  const [rows] = await pool.query(
    "SELECT id FROM skills WHERE name = ?",
    [name]
  );

  if (rows.length > 0) return rows[0].id;

  const [result] = await pool.query(
    "INSERT INTO skills (name) VALUES (?)",
    [name]
  );
  return result.insertId;
}

async function linkSkillToJob(job_application_id, skill_id) {
  await pool.query(
    `INSERT IGNORE INTO job_application_skills
     (job_application_id, skill_id)
     VALUES (?, ?)`,
    [job_application_id, skill_id]
  );
}

module.exports = { getOrCreateSkill, linkSkillToJob };
