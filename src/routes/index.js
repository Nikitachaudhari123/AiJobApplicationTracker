const express = require("express");
const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const aiRoutes = require("./aiRoutes");
const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;
