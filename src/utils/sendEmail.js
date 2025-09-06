const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      .header {
        background: black;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        color: #333333;
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        background-color: black;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        padding: 15px;
        color: #888888;
        background: #f1f1f1;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Dev Tinder</div>
      <div class="content">
        <p>Hi there 👋,</p>
        <p>Welcome to <strong>Dev Tinder</strong>! We’re excited to have you on board.</p>
        <p>Click the button below to get started:</p>
        <p style="text-align:center;">
          <a href="https://devtinder.hemavasupalli.ca" class="button">Get Started</a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Dev Tinder. All rights reserved.<br/>
        This is an automated email, please do not reply.
      </div>
    </div>
  </body>
  </html>
  `;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hi there, Welcome to Dev Tinder! Visit https://devtinder.hemavasupalli.ca to get started.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome to Dev Tinder 🚀",
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "hemavasupalli96@gmail.com",
    "hemavasupalli12@gmail.com"
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

module.exports = { run };
