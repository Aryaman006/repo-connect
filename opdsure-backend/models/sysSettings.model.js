const mongoose = require("mongoose");
const { CONSTANTS } = require("../Constant");

const SysSettingsSchema = new mongoose.Schema(
  {
    docSize: {
        type: Number,
        default: 2048
      },
    file_type: {
        type: String,
        default: "jpeg,pdf"
      },
    speciality: {
      type:Number,
      required:false,
      default:1,
    },
    years_of_exp: {
      type:Number,
      required:false,
      default:1,
    },
    doctor: {
      type:Number,
      required:false,
      default:1,
    },
    appointment: {
      type:Number,
      required:false,
      default:1,
    },
    disclaimer:{
      type:String,
      required:false,
    }
  },
  { timestamps: true }
);

SysSettingsSchema.pre('save', async function(next) {
  const SysSettings = mongoose.model('SysSettings', SysSettingsSchema);
  const count = await SysSettings.countDocuments();
  
  if (count > 0) {
    const error = new Error('Cannot create more than one settings document');
    next(error);
  } else {
    next();
  }
});

const SysSettings = mongoose.model('SysSettings', SysSettingsSchema);

const initializeSettings = async () => {
  try {
    const count = await SysSettings.countDocuments();
    if (count === 0) {
      await SysSettings.create({});
      console.log('Initialized default settings');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

initializeSettings();

module.exports = SysSettings;
