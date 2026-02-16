const Joi = require("joi")
const { CONSTANTS } = require("../Constant")

const AdminAuthSchema = {
    Signup: Joi.object().keys({
        email: Joi.string().email().regex(CONSTANTS.REGEX.EMAIL).required(),
        password: Joi.string().required(),
        confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        country_code: Joi.string().required()
    }),

    Signin: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
}

module.exports = AdminAuthSchema