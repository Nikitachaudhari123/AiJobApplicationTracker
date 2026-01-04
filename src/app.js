// src/app.js
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const routes = require('./routes');

// Middleware
app.use(cors());
app.use(express.json()); // lets us read JSON bodies

app.use('/', routes);

// 404 handler (if no route matched)
app.use((req, res) => {
  res.status(404).json({ success:false, message: 'Route not found', });
});
app.use(errorHandler);
module.exports = app;
