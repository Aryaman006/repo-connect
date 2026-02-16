const mongoose = require("mongoose");
const {CONSTANTS} = require("../Constant/")

const TCSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, 
    },
    condition: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);

TCSchema.pre('save', async function(next) {
  const TC = mongoose.model('TC', TCSchema);
  const count = await TC.countDocuments();
  
  if (count >= 2) {
    const error = new Error('Cannot create more than two settings documents');
    next(error);
  } else {
    next();
  }
});

const TC = mongoose.model('TC', TCSchema);

const initializeSettings = async () => {
  try {
    const count = await TC.countDocuments();
    if (count < 2) {
      const defaultData = [
        {
          type: CONSTANTS.TC_TYPE_ENUM[0],
          condition: "Default payment terms and conditions for signup"
        },
        {
          type: CONSTANTS.TC_TYPE_ENUM[1],
          condition: "Default payment terms and conditions for login"
        }
      ];
      for (let i = count; i < 2; i++) {
        await TC.create(defaultData[i]);
      }
      console.log('Initialized default settings');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

initializeSettings();

module.exports = TC;
