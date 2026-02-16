const {CONSTANTS} = require("../Constant")
const GetExtendedDays = (frequency) => {
    switch(frequency){
        case CONSTANTS.CORPORATE.PLAN_FREQ.YEARLY: return 364;
        case CONSTANTS.CORPORATE.PLAN_FREQ.HALF_YEARLY: return 179;
        case CONSTANTS.CORPORATE.PLAN_FREQ.QUARTERLY: return 89;
        case CONSTANTS.CORPORATE.PLAN_FREQ.MONTHLY: return 29;
        default: return 0;
    }
}

module.exports = GetExtendedDays;