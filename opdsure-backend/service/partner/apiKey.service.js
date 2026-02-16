const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const ApiKeyDal = require("../../DAL/partner/apiKey.dal");
const ApiClientDal = require("../../DAL/partner/apiClient.dal");
const { ApiError } = require("../../Utils");
const config = require("../../Config");

const generateKeyId = () => {
  return crypto.randomBytes(8).toString("hex"); // 16 char hex
};

const generateSecret = () => {
  return crypto.randomBytes(32).toString("hex"); // 64 char hex
};

const hashSecret = (secret) => {
  const pepper = config.API_KEY_PEPPER || "";
  return crypto.createHmac("sha256", pepper).update(secret).digest("hex");
};

const ApiKeyService = {
  Generate: async (clientId, adminId, expiresInDays = 90, rateLimit = 60) => {
    const client = await ApiClientDal.GetById(clientId);
    if (!client) {
      throw new ApiError("API client not found", StatusCodes.NOT_FOUND);
    }

    const keyId = generateKeyId();
    const secret = generateSecret();
    const keyHash = hashSecret(secret);
    const fullKey = `opd_${keyId}_${secret}`;
    const keyPrefix = fullKey.substring(0, 8);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const apiKey = await ApiKeyDal.Create({
      client_id: clientId,
      key_id: keyId,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      status: "active",
      expires_at: expiresAt,
      rate_limit: rateLimit,
      created_by: adminId,
    });

    // Return full key ONLY on creation — never again
    return {
      _id: apiKey._id,
      key_id: apiKey.key_id,
      key_prefix: apiKey.key_prefix,
      full_key: fullKey,
      status: apiKey.status,
      expires_at: apiKey.expires_at,
      rate_limit: apiKey.rate_limit,
      createdAt: apiKey.createdAt,
    };
  },

  GetAllByClientId: async (clientId) => {
    const client = await ApiClientDal.GetById(clientId);
    if (!client) {
      throw new ApiError("API client not found", StatusCodes.NOT_FOUND);
    }
    return ApiKeyDal.GetAllByClientId(clientId);
  },

  Revoke: async (keyId, clientId) => {
    const key = await ApiKeyDal.GetById(keyId);
    if (!key || key.client_id.toString() !== clientId) {
      throw new ApiError("API key not found", StatusCodes.NOT_FOUND);
    }
    if (key.status === "revoked") {
      throw new ApiError("API key is already revoked", StatusCodes.BAD_REQUEST);
    }
    return ApiKeyDal.RevokeKey(keyId);
  },

  Rotate: async (keyId, clientId, adminId, expiresInDays = 90) => {
    const oldKey = await ApiKeyDal.GetById(keyId);
    if (!oldKey || oldKey.client_id.toString() !== clientId) {
      throw new ApiError("API key not found", StatusCodes.NOT_FOUND);
    }

    // Revoke old key
    await ApiKeyDal.RevokeKey(keyId);

    // Generate new key for the same client
    return ApiKeyService.Generate(clientId, adminId, expiresInDays, oldKey.rate_limit);
  },

  /**
   * Verify an API key from the raw header value.
   * Returns { apiKey, apiClient } or throws.
   */
  VerifyKey: async (rawKey) => {
    // Expected format: opd_<key_id>_<secret>
    if (!rawKey || !rawKey.startsWith("opd_")) {
      throw new ApiError("Invalid API key format", StatusCodes.UNAUTHORIZED);
    }

    const parts = rawKey.split("_");
    // parts: ["opd", keyId, secret]
    if (parts.length !== 3) {
      throw new ApiError("Invalid API key format", StatusCodes.UNAUTHORIZED);
    }

    const [, keyId, secret] = parts;

    const apiKey = await ApiKeyDal.GetByKeyId(keyId);
    if (!apiKey) {
      throw new ApiError("Invalid API key", StatusCodes.UNAUTHORIZED);
    }

    if (apiKey.status !== "active") {
      throw new ApiError("API key is " + apiKey.status, StatusCodes.UNAUTHORIZED);
    }

    if (new Date() > new Date(apiKey.expires_at)) {
      // Mark as expired in DB (fire-and-forget)
      ApiKeyDal.Update(apiKey._id, { status: "expired" }).catch(() => {});
      throw new ApiError("API key has expired", StatusCodes.UNAUTHORIZED);
    }

    // Constant-time comparison
    const providedHash = hashSecret(secret);
    const storedHash = apiKey.key_hash;
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedHash, "hex"),
      Buffer.from(storedHash, "hex")
    );

    if (!isValid) {
      throw new ApiError("Invalid API key", StatusCodes.UNAUTHORIZED);
    }

    // Update last_used_at (fire-and-forget)
    ApiKeyDal.UpdateLastUsed(apiKey._id).catch(() => {});

    const client = await ApiClientDal.GetById(apiKey.client_id);
    if (!client || client.status === 0) {
      throw new ApiError("API client is inactive", StatusCodes.FORBIDDEN);
    }

    return { apiKey, apiClient: client };
  },
};

module.exports = ApiKeyService;
