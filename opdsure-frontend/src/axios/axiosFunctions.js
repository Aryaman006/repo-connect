import axios from "axios";
import config from "../config/config";

export const Axios = {


  getTestList: async (url, configObj = {}) => {
    try {
      const result = await axios.get(`${config.ApiBaseUrl}${url}`, configObj);
      const array = Object.entries(result.data.data).map(([name, value]) => ({
        name,
        value,
      }));
      return array;
    } catch (error) {
      return [];
    }
  },

  fetchAxiosData: async (url, query = {}, configObj = {}) => {
    try {
      const response = await axios.get(`${config.ApiBaseUrl}${url}`, query, configObj);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  postAxiosData: async (url, data, configObj = {}) => {
    try {
      const response = await axios.post(`${config.ApiBaseUrl}${url}`, data, configObj);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  putAxiosData: async (url, data, configObj = {}) => {
    try {
      const response = await axios.put(`${config.ApiBaseUrl}${url}`, data, configObj);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  patchAxiosData: async (url, data, configObj = {}) => {
    try {
      const response = await axios.patch(`${config.ApiBaseUrl}${url}`, data, configObj);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },


  deleteAxiosData: async (url, configObj = {}) => {
    try {
      const response = await axios.delete(`${config.ApiBaseUrl}${url}`, configObj);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

};