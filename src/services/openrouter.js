const axios = require("axios");

async function openRouterChat({ prompt, system }) {
  const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  const res = await axios.post(
    `${baseURL}/chat/completions`,
    {
      model,
      messages: [
        { role: "system", content: system || "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // optional but recommended by OpenRouter:
        "HTTP-Referer": "http://localhost",
        "X-Title": "AI Job Tracker",
      },
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = { openRouterChat };
