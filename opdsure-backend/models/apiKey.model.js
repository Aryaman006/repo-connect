const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "api_clients",
      required: true,
    },
    key_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    key_prefix: {
      type: String,
      required: true,
    },
    key_hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    revoked_at: {
      type: Date,
      default: null,
    },
    rate_limit: {
      type: Number,
      default: 60,
      required: true,
    },
    last_used_at: {
      type: Date,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admindetails",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("api_keys", ApiKeySchema);
