const TestModel = require("../models/test"); // Adjust path if needed

const TestDal = {
  GetHealthTests: async () => {
    return await TestModel.find()
      .populate("plan", "name membership_options") // populate plan info if needed
      .lean()
      .exec();
  },
};

module.exports = TestDal;
