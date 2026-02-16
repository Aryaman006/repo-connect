const mongoose = require("mongoose");

const ApiUsageLogSchema = new mongoose.Schema({
  key_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "api_keys",
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "api_clients",
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  status_code: {
    type: Number,
  },
  response_time_ms: {
    type: Number,
  },
  ip_address: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: { expires: 7776000 }, // 90 days TTL in seconds
  },
});

module.exports = mongoose.model("api_usage_logs", ApiUsageLogSchema);
