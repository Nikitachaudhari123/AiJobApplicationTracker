// src/app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // lets us read JSON bodies

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Job Tracker API is running" });
});

module.exports = app;
