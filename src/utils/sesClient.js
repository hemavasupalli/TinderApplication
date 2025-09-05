
const { SESClient } = require("@aws-sdk/client-ses");

// Create SES service object.
const sesClient = new SESClient({ region: process.env.REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
 });
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]