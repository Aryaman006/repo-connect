const axios = require('axios'); 
const SMS_API_URL = process.env.SMS_API_URL;
const SMS_USER = process.env.SMS_USER;
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;

const SendSMS = async (query) => {
    // return;
   
    const URL = `${SMS_API_URL}?user=${encodeURIComponent(SMS_USER)}&key=${encodeURIComponent(SMS_API_KEY)}&senderid=${encodeURIComponent(SMS_SENDER_ID)}&accusage=1&message=${encodeURIComponent(query.message)}&mobile=${query.phone}`
    
    axios.post(URL);
    return {};
};
const SendSMSAwait = async (query) => {
    console.log("sending sms in sync");
    const resp = await axios.post(SMS_API_URL,{
        params:{
            user:SMS_USER,
            key:SMS_API_KEY,
            accusage: query.accusage,
            mobile: query.phone,
            senderid:SMS_SENDER_ID,
            message:query.message
        }
    });
    console.log("res",resp)
    return {}
};

module.exports = { SendSMS, SendSMSAwait };