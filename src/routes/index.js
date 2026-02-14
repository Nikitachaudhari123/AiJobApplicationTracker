const express = require("express");
const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const aiRoutes = require("./aiRoutes");
const resumeRoutes = require("./resumeRoutes");
const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/jobs", jobRoutes);
router.use("/resume", resumeRoutes);

module.exports = router;
