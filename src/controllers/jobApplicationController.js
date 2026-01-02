const jobModel = require("../models/jobApplicationModel");
const statusHistoryModel = require("../models/statusHistoryModel");
const skillModel = require("../models/skillModel");
// CREATE job
async function createJob(req, res) {
  try {
    const { job_title, company, job_description } = req.body;
    const userId = req.user.id;

    if (!job_title || !company) {
      return res.status(400).json({ message: "Job title and company required" });
    }

    const jobId = await jobModel.createJobApplication({
      user_id: userId,
      job_title,
      company,
      job_description,
    });

    res.status(201).json({
      message: "Job created successfully",
      jobId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET jobs for logged-in user
async function getJobs(req, res) {
  try {
    const userId = req.user.id;
    const jobs = await jobModel.getAllJobApplications(userId);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// UPDATE job status
async function updateJob(req, res) {
  try {
    const jobId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // 1️⃣ Fetch job (ownership check)
    const job = await jobModel.getJobApplicationById(jobId, userId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Save status history
    await statusHistoryModel.addStatusHistory({
      job_application_id: jobId,
      old_status: job.status,
      new_status: status,
    });

    // 3️⃣ Update job table (THIS WAS MISSING)
    await jobModel.updateJobStatus(jobId, userId, status);

    res.json({ message: "Job status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE job
async function deleteJob(req, res) {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const deleted = await jobModel.deleteJobApplication(
      jobId,
      userId
    );

    if (deleted === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add Skills to Job
async function addSkillsToJob(req, res) {
  const jobId = req.params.id;
  const { skills } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: "Skills must be an array" });
  }

  const job = await jobModel.getJobApplicationById(jobId, userId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  for (const skill of skills) {
    const skillId = await skillModel.getOrCreateSkill(skill);
    await skillModel.linkSkillToJob(jobId, skillId);
  }

  res.json({ message: "Skills added successfully" });
}

// Job History
async function getJobHistory(req, res) {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await jobModel.getJobApplicationById(jobId, userId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const history = await statusHistoryModel.getStatusHistory(jobId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,addSkillsToJob, getJobHistory
};
