// src/routes/resumeRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createResumeScore, getResumeScoreHistory } = require("../controllers/resumeController");

const router = express.Router();

router.post("/score", auth, createResumeScore);
router.get("/history", auth, getResumeScoreHistory);

module.exports = router;
