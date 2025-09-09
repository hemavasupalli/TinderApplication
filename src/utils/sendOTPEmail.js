const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
  };

  
const CreateSendOTPEmail = async (toEmail, fromAddress, otp) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h2>Your OTP Code</h2><p>Use this code to verify your email: <b>${otp}</b></p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Your OTP Code: ${otp}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Verify your email - Dev Tinder",
      },
    },
    Source: fromAddress, // must be verified in SES
  });

  try {
    const result = await sesClient.send(command);
  } catch (err) {
    console.error("Error sending OTP email:", err);
  }
};

const runOTP = async () => {
  const sendEmailCommand = CreateSendOTPEmail(
    "hemavasupalli96@gmail.com",
    "hemavasupalli12@gmail.com",
    generateOTP()
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { runOTP };
