// src/controllers/healthController.js
function getHealth(req, res) {
  return res.json({
    status: 'ok',
    message: 'AI Job Tracker API is running',
  });
}

module.exports = { getHealth };
