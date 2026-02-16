const ApiUsageLog = require("../../models/apiUsageLog.model");

const ApiUsageLogDal = {
  Create: (data) => new ApiUsageLog(data).save(),
};

module.exports = ApiUsageLogDal;
