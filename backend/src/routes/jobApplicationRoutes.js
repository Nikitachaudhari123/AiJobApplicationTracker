// src/routes/jobApplicationRoutes.js
const express = require('express');
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/jobApplicationController');

const router = express.Router();

// Base: /api/applications
router.post('/', createApplication);
router.get('/', getApplications);

// Update only status
router.patch('/:id/status', updateApplicationStatus);

// Delete
router.delete('/:id', deleteApplication);

module.exports = router;
