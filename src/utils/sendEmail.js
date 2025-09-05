const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "<h1>HEllo from AWS SES</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "TEXT_FORMAT_BODY",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "dev tinder",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  const run = async () => {
    const sendEmailCommand = createSendEmailCommand("hemavasupalli96@gmail.com","hemavasupalli12@gmail.com");
  
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
module.exports = { run };