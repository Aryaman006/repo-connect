const { StatusCodes } = require("http-status-codes");
const ApiKeyService = require("../service/partner/apiKey.service");

const apiKeyAuth = async (req, res, next) => {
  try {
    const rawKey = req.headers["x-api-key"];

    if (!rawKey) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        data: [],
        success: false,
        message: "Missing X-API-KEY header",
      });
    }

    const { apiKey, apiClient } = await ApiKeyService.VerifyKey(rawKey);

    req.apiKey = apiKey;
    req.apiClient = apiClient;
    next();
  } catch (error) {
    return res.status(error.status_code || StatusCodes.UNAUTHORIZED).json({
      data: [],
      success: false,
      message: error.message || "Invalid API key",
    });
  }
};

module.exports = apiKeyAuth;
