const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs, updateJob, deleteJob, getJobHistory,addSkillsToJob
} = require("../controllers/jobApplicationController");

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);
router.get("/:id/history", authMiddleware, getJobHistory);
router.post("/:id/skills", authMiddleware, addSkillsToJob);


module.exports = router;
