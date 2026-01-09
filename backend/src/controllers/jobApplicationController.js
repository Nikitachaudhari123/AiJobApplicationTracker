const jobModel = require("../models/jobApplicationModel");
const statusHistoryModel = require("../models/statusHistoryModel");
const skillModel = require("../models/skillModel");
const AppError = require("../utils/AppError");

// CREATE job
async function createJob(req, res, next) {
  try {
    const { job_title, company, job_description } = req.body;
    const userId = req.user.id;

    if (!job_title?.trim() || !company?.trim()) {
      throw new AppError("Job title and company are required", 400);
    }

    const jobId = await jobModel.createJobApplication({
      user_id: userId,
      job_title,
      company,
      job_description,
    });

    res.status(201).json({
      success: true,
      data: { jobId },
    });
  } catch (error) {
    next(error);
  }
}

// GET jobs (pagination + filtering)
async function getJobs(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, company } = req.query;

    const jobs = await jobModel.getAllJobApplications({
      user_id: userId,
      page: Number(page),
      limit: Number(limit),
      status,
      company,
    });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE job status
async function updateJob(req, res, next) {
  try {
    const jobId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const allowedStatuses = ["applied", "interview", "offer", "rejected"];
    if (!allowedStatuses.includes(status)) {
      throw new AppError("Invalid status value", 400);
    }

    const job = await jobModel.getJobApplicationById(jobId, userId);
    if (!job) {
      throw new AppError("Job not found", 404);
    }

    await statusHistoryModel.addStatusHistory({
      job_application_id: jobId,
      old_status: job.status,
      new_status: status,
    });

    await jobModel.updateJobStatus(jobId, userId, status);

    res.json({
      success: true,
      message: "Job status updated",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE job
async function deleteJob(req, res, next) {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const deleted = await jobModel.deleteJobApplication(jobId, userId);
    if (deleted === 0) {
      throw new AppError("Job not found", 404);
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ADD skills to job
async function addSkillsToJob(req, res, next) {
  try {
    const jobId = req.params.id;
    const { skills } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(skills)) {
      throw new AppError("Skills must be an array", 400);
    }

    const job = await jobModel.getJobApplicationById(jobId, userId);
    if (!job) {
      throw new AppError("Job not found", 404);
    }

    for (const skill of skills) {
      const skillId = await skillModel.getOrCreateSkill(skill);
      await skillModel.linkSkillToJob(jobId, skillId);
    }

    res.json({
      success: true,
      message: "Skills added successfully",
    });
  } catch (error) {
    next(error);
  }
}

// JOB history
async function getJobHistory(req, res, next) {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await jobModel.getJobApplicationById(jobId, userId);
    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const history = await statusHistoryModel.getStatusHistory(jobId);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  addSkillsToJob,
  getJobHistory,
};