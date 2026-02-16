const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../Middleware/apiKeyAuth");
const rateLimiter = require("../Middleware/rateLimiter");
const usageLogger = require("../Middleware/usageLogger");

// Apply middleware in correct order to ALL partner routes
router.use(apiKeyAuth);
router.use(rateLimiter);
router.use(usageLogger);

// ─── Health Check ──────────────────────────────────────────
router.get("/health", (req, res) => {
  return res.status(200).json({
    data: {
      status: "ok",
      client: req.apiClient.name,
      timestamp: new Date().toISOString(),
    },
    success: true,
    message: "Partner API is healthy",
  });
});

module.exports = router;
