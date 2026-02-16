const Joi = require("joi");

const ApiClientSchema = {
  Create: Joi.object().keys({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().required(),
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.number().valid(0, 1).optional(),
  }),

  Update: Joi.object().keys({
    name: Joi.string().min(2).max(150).optional(),
    email: Joi.string().email().optional(),
    description: Joi.string().max(500).optional().allow(""),
    status: Joi.number().valid(0, 1).optional(),
  }),
};

module.exports = ApiClientSchema;
