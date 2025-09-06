
const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();

// Create SES service object.
const sesClient = new SESClient({ region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
 });
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]