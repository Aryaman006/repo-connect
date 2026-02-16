const ApiClient = require("../../models/apiClient.model");

const ApiClientDal = {
  Create: (data) => new ApiClient(data).save(),

  GetAll: (query, page, pageSize, sortBy, sortOrder) => {
    const skip = (page - 1) * pageSize;
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    return ApiClient.find(query).sort(sort).skip(skip).limit(pageSize).lean();
  },

  Count: (query) => ApiClient.countDocuments(query),

  GetById: (id) => ApiClient.findById(id).lean(),

  GetByName: (name) => ApiClient.findOne({ name }).lean(),

  Update: (id, data) =>
    ApiClient.findByIdAndUpdate(id, data, { new: true }).lean(),

  Delete: (id) => ApiClient.findByIdAndDelete(id),
};

module.exports = ApiClientDal;
