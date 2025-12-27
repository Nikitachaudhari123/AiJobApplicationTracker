// src/controllers/jobApplicationController.js
const asyncHandler = require('../utils/asyncHandler');
const JobApp = require('../models/jobApplicationModel');

const ALLOWED_STATUSES = new Set(['Applied', 'Interview', 'Rejected', 'Offer']);

const createApplication = asyncHandler(async (req, res) => {
  const { job_title, company, status, job_description } = req.body;

  if (!job_title || !company) {
    const err = new Error('job_title and company are required');
    err.statusCode = 400;
    throw err;
  }

  const finalStatus = status || 'Applied';
  if (!ALLOWED_STATUSES.has(finalStatus)) {
    const err = new Error(`Invalid status. Use: ${Array.from(ALLOWED_STATUSES).join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const insertId = await JobApp.createJobApplication({
    job_title,
    company,
    status: finalStatus,
    job_description,
  });

  const created = await JobApp.getJobApplicationById(insertId);

  return res.status(201).json(created);
});

const getApplications = asyncHandler(async (req, res) => {
  const rows = await JobApp.getAllJobApplications();
  return res.json(rows);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  if (!status) {
    const err = new Error('status is required');
    err.statusCode = 400;
    throw err;
  }

  if (!ALLOWED_STATUSES.has(status)) {
    const err = new Error(`Invalid status. Use: ${Array.from(ALLOWED_STATUSES).join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const affected = await JobApp.updateJobStatus(id, status);

  if (affected === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  const updated = await JobApp.getJobApplicationById(id);
  return res.json(updated);
});

const deleteApplication = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Invalid id');
    err.statusCode = 400;
    throw err;
  }

  const affected = await JobApp.deleteJobApplication(id);

  if (affected === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  return res.status(204).send();
});

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
};
