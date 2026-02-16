const ApiUsageLogDal = require("../DAL/partner/apiUsageLog.dal");

const usageLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    // Fire-and-forget: must never block the response
    try {
      const logData = {
        key_id: req.apiKey ? req.apiKey._id : null,
        client_id: req.apiClient ? req.apiClient._id : null,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        response_time_ms: Date.now() - startTime,
        ip_address:
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.ip,
      };

      if (logData.key_id && logData.client_id) {
        ApiUsageLogDal.Create(logData).catch((err) => {
          console.error("Usage log write failed:", err.message);
        });
      }
    } catch (err) {
      console.error("Usage logger error:", err.message);
    }
  });

  next();
};

module.exports = usageLogger;
