const brevo = require('@getbrevo/brevo');
const config = require("../Config")

let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = config.BREVO_API_KEY;


const sendMailBrevo = async (body,subject,user,params) => {
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body;
    sendSmtpEmail.sender = { "name": config.BREVO_SENDER_NAME , "email": config.BREVO_EMAIL_FROM };
    sendSmtpEmail.to = [
    { "email": user.email , "name": user.name }
    ];
    sendSmtpEmail.replyTo = { "email": config.BREVO_EMAIL_FROM, "name": config.BREVO_SENDER_NAME };
    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = params;

    // apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    //     console.log('API called successfully. Returned data: ');
    //   }, function (error) {
    //     console.error(error);
    //   });
    try {
        apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        console.log("error in sending email".error)
    }
};

module.exports = sendMailBrevo;
