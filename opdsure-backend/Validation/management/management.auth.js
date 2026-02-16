const Joi = require("joi")

const ManagementAuthSchema = {

    Login: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),

}

module.exports = ManagementAuthSchema