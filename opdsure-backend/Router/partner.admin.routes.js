const express = require("express");
const router = express.Router();
const { ValidateRequest, AdminAuth, ValidatePrivilege } = require("../Middleware/index");
const { CatchAsync } = require("../Utils");
const { CommonSchema } = require("../Validation");
const ApiClientSchema = require("../Validation/partner/apiClient");
const ApiKeySchema = require("../Validation/partner/apiKey");
const ApiClientController = require("../controller/partner/apiClient.controller");
const ApiKeyController = require("../controller/partner/apiKey.controller");
const { CONSTANTS } = require("../Constant");

// ─── API Clients ───────────────────────────────────────────
router.post(
  "/api-clients",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_CLIENTS.id, "POST"),
  ValidateRequest(ApiClientSchema.Create, "body"),
  CatchAsync(ApiClientController.Create)
);

router.get(
  "/api-clients",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_CLIENTS.id, "GET"),
  ValidateRequest(CommonSchema.Pagination, "query"),
  CatchAsync(ApiClientController.GetAll)
);

router.get(
  "/api-clients/:id",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_CLIENTS.id, "GET"),
  ValidateRequest(CommonSchema.ParamsId, "params"),
  CatchAsync(ApiClientController.GetById)
);

router.patch(
  "/api-clients/:id",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_CLIENTS.id, "PATCH"),
  ValidateRequest(CommonSchema.ParamsId, "params"),
  ValidateRequest(ApiClientSchema.Update, "body"),
  CatchAsync(ApiClientController.Update)
);

router.delete(
  "/api-clients/:id",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_CLIENTS.id, "DELETE"),
  ValidateRequest(CommonSchema.ParamsId, "params"),
  CatchAsync(ApiClientController.Delete)
);

// ─── API Keys ──────────────────────────────────────────────
router.post(
  "/api-clients/:clientId/keys",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_KEYS.id, "POST"),
  ValidateRequest(ApiKeySchema.Generate, "body"),
  CatchAsync(ApiKeyController.Generate)
);

router.get(
  "/api-clients/:clientId/keys",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_KEYS.id, "GET"),
  CatchAsync(ApiKeyController.GetAll)
);

router.post(
  "/api-clients/:clientId/keys/:keyId/rotate",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_KEYS.id, "POST"),
  ValidateRequest(ApiKeySchema.Rotate, "body"),
  CatchAsync(ApiKeyController.Rotate)
);

router.patch(
  "/api-clients/:clientId/keys/:keyId/revoke",
  AdminAuth,
  ValidatePrivilege(CONSTANTS.PRIVILEGE.PROGRAMME.ADMIN.API_KEYS.id, "PATCH"),
  CatchAsync(ApiKeyController.Revoke)
);

module.exports = router;
