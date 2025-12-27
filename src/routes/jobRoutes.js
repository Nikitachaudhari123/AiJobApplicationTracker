const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
} = require("../controllers/jobApplicationController");

const router = express.Router();

// 🔒 Protected routes
router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);

module.exports = router;
