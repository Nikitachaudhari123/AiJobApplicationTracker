const { openRouterChat } = require("../services/openrouter");

async function analyzeJob(req, res, next) {
  try {
    const { job_description } = req.body;

    if (!job_description || !job_description.trim()) {
      return res.status(400).json({ success: false, message: "job_description is required" });
    }

    const system =
      
  "Extract structured info from a job description. Return ONLY valid JSON with keys: company, role, skills, experience, keywords. company/role/experience are strings. skills/keywords must be arrays of strings.";

    const prompt = `
Job Description:
"""
${job_description}
"""
Return JSON only.
`;

    const text = await openRouterChat({ system, prompt });

    // try to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback if model wraps text around json
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed) {
      return res.status(500).json({
        success: false,
        message: "AI response could not be parsed as JSON",
        raw: text,
      });
    }

    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeJob };
