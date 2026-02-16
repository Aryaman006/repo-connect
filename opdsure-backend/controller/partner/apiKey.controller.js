const { StatusCodes } = require("http-status-codes");
const { ResponseHandler } = require("../../Utils");
const ApiKeyService = require("../../service/partner/apiKey.service");

const ApiKeyController = {
  Generate: async (req, res) => {
    const { clientId } = req.params;
    const { expires_in_days = 90, rate_limit = 60 } = req.body;
    const result = await ApiKeyService.Generate(clientId, req.admin._id, expires_in_days, rate_limit);
    return ResponseHandler(res, StatusCodes.CREATED, result, true, "API key generated successfully. Store the full_key securely — it will not be shown again.");
  },

  GetAll: async (req, res) => {
    const keys = await ApiKeyService.GetAllByClientId(req.params.clientId);
    return ResponseHandler(res, StatusCodes.OK, keys, true, "API keys fetched successfully");
  },

  Revoke: async (req, res) => {
    const result = await ApiKeyService.Revoke(req.params.keyId, req.params.clientId);
    return ResponseHandler(res, StatusCodes.OK, result, true, "API key revoked successfully");
  },

  Rotate: async (req, res) => {
    const { expires_in_days = 90 } = req.body;
    const result = await ApiKeyService.Rotate(req.params.keyId, req.params.clientId, req.admin._id, expires_in_days);
    return ResponseHandler(res, StatusCodes.OK, result, true, "API key rotated successfully. Store the new full_key securely.");
  },
};

module.exports = ApiKeyController;
