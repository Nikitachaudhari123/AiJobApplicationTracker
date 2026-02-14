// src/utils/resumeScorer.js

const ROLE_KEYWORDS = {
  "Junior DBA": [
    "sql", "mysql", "postgresql", "database", "schema", "index", "query",
    "joins", "normalization", "backup", "restore", "performance", "etl",
    "data integrity", "troubleshooting", "stored procedure", "views"
  ],
  "Systems Analyst": [
    "requirements", "stakeholders", "documentation", "user stories", "process",
    "testing", "sql", "integration", "support", "jira", "agile", "sdlc"
  ],
};

function normalize(text = "") {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function wordSet(text = "") {
  const tokens = normalize(text).split(/[^a-z0-9+.#]+/i).filter(Boolean);
  return new Set(tokens);
}

function countKeywordMatches(text, keywords) {
  const t = normalize(text);
  const matched = [];
  for (const k of keywords) {
    if (t.includes(k.toLowerCase())) matched.push(k);
  }
  return matched;
}

function atsHeuristics(raw) {
  const suggestions = [];

  const hasExp = /experience|work experience/i.test(raw);
  const hasSkills = /skills|technical skills/i.test(raw);
  const hasEdu = /education/i.test(raw);

  if (!hasExp) suggestions.push("Add an 'Experience' section with 3–6 impact bullets.");
  if (!hasSkills) suggestions.push("Add a 'Skills' section grouped by category (SQL/DB/Tools).");
  if (!hasEdu) suggestions.push("Add an 'Education' section with graduation date.");

  const bullets = (raw.match(/^\s*[-•]/gm) || []).length;
  if (bullets < 6) suggestions.push("Use more bullets (at least 6+) to improve ATS readability.");

  const hasNumbers = /\b\d+%|\b\d+\b/.test(raw);
  if (!hasNumbers) suggestions.push("Add metrics (e.g., reduced query time by 30%, handled 200+ rows).");

  const tooShort = raw.length < 1200;
  const tooLong = raw.length > 12000;
  if (tooShort) suggestions.push("Resume looks short — add more project/impact detail.");
  if (tooLong) suggestions.push("Resume looks long — consider tightening to 1–2 pages.");

  return suggestions;
}

function scoreResume({ resumeText, jobDescription = "", targetRole = "Junior DBA" }) {
  const base = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS["Junior DBA"];

  // Optional: add light JD keywords (top-ish unique tokens)
  const jdTokens = [...wordSet(jobDescription)]
    .filter(w => w.length >= 4)
    .slice(0, 80);

  const keywords = [...new Set([...base, ...jdTokens])];

  const matched = countKeywordMatches(resumeText, keywords);
  const missing = keywords.filter(k => !matched.includes(k));

  const ats = atsHeuristics(resumeText);

  // Score breakdown:
  // - keyword coverage: 55
  // - ATS structure: 25
  // - length sanity: 10
  // - JD alignment: 10 (or partial)
  let score = 0;

  const keywordRatio = matched.length / Math.max(1, keywords.length);
  score += Math.round(Math.min(55, keywordRatio * 55));

  const atsPenalty = Math.min(25, ats.length * 5);
  score += (25 - atsPenalty);

  const len = resumeText.length;
  if (len > 1500 && len < 9000) score += 10;
  else if (len >= 9000) score += 6;
  else score += 4;

  if (jobDescription && jobDescription.trim().length > 50) {
    const jdMatched = countKeywordMatches(resumeText, jdTokens).length;
    const jdRatio = jdMatched / Math.max(1, jdTokens.length);
    score += Math.round(Math.min(10, jdRatio * 10));
  } else {
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  const suggestions = [
    ...ats,
    missing.length
      ? `Add/reflect missing keywords (top): ${missing.slice(0, 12).join(", ")}`
      : "Great keyword coverage — focus on metrics and clarity.",
  ];

  return {
    score,
    matched_keywords: matched,
    missing_keywords: missing.slice(0, 50),
    suggestions,
  };
}

module.exports = { scoreResume };
