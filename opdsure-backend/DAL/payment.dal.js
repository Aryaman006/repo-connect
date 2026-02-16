const { payments } = require("../models");

const PaymentDal = {

    Create: async (data) => await payments.create(data),

};

module.exports = PaymentDal;
