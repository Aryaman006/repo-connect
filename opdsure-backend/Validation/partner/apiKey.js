const Joi = require("joi");

const ApiKeySchema = {
  Generate: Joi.object().keys({
    expires_in_days: Joi.number().integer().min(1).max(365).optional().default(90),
    rate_limit: Joi.number().integer().min(1).max(10000).optional().default(60),
  }),

  Rotate: Joi.object().keys({
    expires_in_days: Joi.number().integer().min(1).max(365).optional().default(90),
  }),
};

module.exports = ApiKeySchema;
