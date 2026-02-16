const { StatusCodes } = require("http-status-codes");
const ApiClientDal = require("../../DAL/partner/apiClient.dal");
const { ApiError } = require("../../Utils");

const ApiClientService = {
  Create: async (data) => {
    const existing = await ApiClientDal.GetByName(data.name);
    if (existing) {
      throw new ApiError("API client with this name already exists", StatusCodes.CONFLICT);
    }
    return ApiClientDal.Create(data);
  },

  GetAll: async (query, page = 1, pageSize = 10, sortBy = "createdAt", sortOrder = "desc") => {
    const filter = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      ApiClientDal.GetAll(filter, page, pageSize, sortBy, sortOrder),
      ApiClientDal.Count(filter),
    ]);
    return { data, total, page, pageSize };
  },

  GetById: async (id) => {
    const client = await ApiClientDal.GetById(id);
    if (!client) {
      throw new ApiError("API client not found", StatusCodes.NOT_FOUND);
    }
    return client;
  },

  Update: async (id, data) => {
    const client = await ApiClientDal.GetById(id);
    if (!client) {
      throw new ApiError("API client not found", StatusCodes.NOT_FOUND);
    }
    if (data.name && data.name !== client.name) {
      const existing = await ApiClientDal.GetByName(data.name);
      if (existing) {
        throw new ApiError("API client with this name already exists", StatusCodes.CONFLICT);
      }
    }
    return ApiClientDal.Update(id, data);
  },

  Delete: async (id) => {
    const client = await ApiClientDal.GetById(id);
    if (!client) {
      throw new ApiError("API client not found", StatusCodes.NOT_FOUND);
    }
    return ApiClientDal.Delete(id);
  },
};

module.exports = ApiClientService;
