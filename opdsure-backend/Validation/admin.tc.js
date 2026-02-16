const Joi = require("joi");

const TCSchema = {

    Edit: Joi.object().keys({      
        condition: Joi.string().max(50000).required(), 
    }),

}

module.exports = TCSchema;