const Joi = require("joi")
const { CONSTANTS } = require("../../Constant")
const { CONSTANTS_MESSAGES } = require("../../Helper")

const HrAuthSchema = {

    Login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    ResetPassword: Joi.object().keys({
        password: Joi.string().required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).messages({ 'any.only': 'Passwords do not match' }).required(),
    }),
}

module.exports = HrAuthSchema;