// src/routes/index.js
const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const jobApplicationRoutes = require('./jobApplicationRoutes');

const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use('/api/applications', jobApplicationRoutes);

module.exports = router;
