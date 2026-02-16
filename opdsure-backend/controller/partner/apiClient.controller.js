const { StatusCodes } = require("http-status-codes");
const { ResponseHandler } = require("../../Utils");
const ApiClientService = require("../../service/partner/apiClient.service");

const ApiClientController = {
  Create: async (req, res) => {
    const data = {
      ...req.body,
      created_by: req.admin._id,
    };
    const client = await ApiClientService.Create(data);
    return ResponseHandler(res, StatusCodes.CREATED, client, true, "API client created successfully");
  },

  GetAll: async (req, res) => {
    const { search, page = 1, pageSize = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const result = await ApiClientService.GetAll({ search }, Number(page), Number(pageSize), sortBy, sortOrder);
    return ResponseHandler(res, StatusCodes.OK, result, true, "API clients fetched successfully");
  },

  GetById: async (req, res) => {
    const client = await ApiClientService.GetById(req.params.id);
    return ResponseHandler(res, StatusCodes.OK, client, true, "API client fetched successfully");
  },

  Update: async (req, res) => {
    const client = await ApiClientService.Update(req.params.id, req.body);
    return ResponseHandler(res, StatusCodes.OK, client, true, "API client updated successfully");
  },

  Delete: async (req, res) => {
    await ApiClientService.Delete(req.params.id);
    return ResponseHandler(res, StatusCodes.OK, [], true, "API client deleted successfully");
  },
};

module.exports = ApiClientController;
