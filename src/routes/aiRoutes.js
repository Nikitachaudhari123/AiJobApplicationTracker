const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeJob } = require("../controllers/aiController");

const router = express.Router();

// Protected: user must be logged in
router.post("/analyze-job", authMiddleware, analyzeJob);

module.exports = router;
