const ApiKey = require("../../models/apiKey.model");

const ApiKeyDal = {
  Create: (data) => new ApiKey(data).save(),

  GetByKeyId: (key_id) => ApiKey.findOne({ key_id }).lean(),

  GetAllByClientId: (client_id) =>
    ApiKey.find({ client_id })
      .select("-key_hash")
      .sort({ createdAt: -1 })
      .lean(),

  GetById: (id) => ApiKey.findById(id).lean(),

  Update: (id, data) =>
    ApiKey.findByIdAndUpdate(id, data, { new: true }).lean(),

  UpdateLastUsed: (id) =>
    ApiKey.findByIdAndUpdate(id, { last_used_at: new Date() }),

  RevokeKey: (id) =>
    ApiKey.findByIdAndUpdate(
      id,
      { status: "revoked", revoked_at: new Date() },
      { new: true }
    ).lean(),

  CountActiveByClientId: (client_id) =>
    ApiKey.countDocuments({ client_id, status: "active" }),
};

module.exports = ApiKeyDal;
