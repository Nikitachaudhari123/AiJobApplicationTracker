// src/routes/index.js
const express = require('express');
const healthRoutes = require('./healthRoutes');
const jobApplicationRoutes = require('./jobApplicationRoutes');

const router = express.Router();
router.use(healthRoutes);
router.use('/api/applications', jobApplicationRoutes);

module.exports = router;
