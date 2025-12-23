const pool = require("../config/db");

// App status check (NO DB)
function getStatus(req, res) {
  return res.json({
    status: "OK",
    message: "AI Job Tracker API is running",
  });
}

// Database health check
async function getHealth(req, res) {
  try {
    await pool.query("SELECT 1");
    return res.json({
      status: "OK",
      database: "connected",
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      database: "not connected",
      message: error.message,
    });
  }
}

module.exports = { getStatus, getHealth };
