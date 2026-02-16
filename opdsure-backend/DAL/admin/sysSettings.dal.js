const { sysSettings } = require("../../models");

const SysSettings = {
  GetSysSettings: async (query) => await sysSettings.find(query),
  EditSysSettings: async (filter,update) => await sysSettings.findOneAndUpdate(filter,update),
};

module.exports = SysSettings;
