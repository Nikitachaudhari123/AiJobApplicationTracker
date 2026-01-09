// src/routes/healthRoutes.js
const express = require('express');
const { getHealth, getStatus } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', getHealth);
router.get('/status', getStatus);
module.exports = router;
