export const emailParams = ( emailId , otp , firstName)=>{
    return {
    Destination: { ToAddresses: [emailId] },
    Message: {
      Subject: { Charset: "UTF-8", Data: "Your Verification OTP" }, // ✅ Must be here
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0; padding:0; background-color:#f6f6f6; font-family: Arial, sans-serif;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f6f6f6; padding:20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                      
                      <!-- Header -->
                      <tr>
                        <td style="background-color:#000000; color:#ffffff; text-align:center; padding:20px; font-size:22px; font-weight:bold;">
                          DevTinder
                        </td>
                      </tr>
                      
                      <!-- Body -->
                      <tr>
                        <td style="padding:30px; background-color:#ffffff; text-align:center;">
                          <p style="font-size:16px; margin:0 0 15px;">Hello <b>${firstName}</b> 👋,</p>
                          <p style="font-size:16px; margin:0 0 15px;">Thank you for signing up! Use the OTP below to verify your email:</p>
                          
                          <!-- OTP -->
                          <p style="font-size:28px; font-weight:bold; letter-spacing:4px; border:2px solid #000000; padding:12px 25px; display:inline-block; margin:20px 0; background-color:#ffffff; color:#000000;">
                            ${otp}
                          </p>
      
                          <p style="font-size:14px; color:#555; margin-top:20px;">
                            This OTP will expire in 10 minutes.<br/>
                            Please do not share it with anyone.
                          </p>
                        </td>
                      </tr>
      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color:#000000; color:#ffffff; text-align:center; padding:15px; font-size:12px;">
                          &copy; ${new Date().getFullYear()} DevTinder By Hema Vasupalli. All rights reserved.
                        </td>
                      </tr>
      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        },
      },
    },
    Source: process.env.SES_SOURCE_EMAIL, // must be verified in SES
  }
}
  
export const  emailParamsForSignup = ( toEmailId , firstName , )=>{
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
        <p>Hi ${firstName} 👋,</p>
        <p>Welcome to <strong>Dev Tinder</strong>! We’re excited to have you on board.</p>
        <p>Click the button below to get started:</p>
        <p style="text-align:center;">
          <a href="https://devtinder.hemavasupalli.ca" class="button">Get Started</a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Dev Tinder By Hema Vasupalli. All rights reserved.<br/>
        This is an automated email, please do not reply.
      </div>
    </div>
  </body>
  </html>
  `;
   return {
        Destination: {
          ToAddresses: [toEmailId],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: htmlBody,
            },
            Text: {
              Charset: "UTF-8",
              Data:`"Hi ${firstName}, Welcome to Dev Tinder! Visit https://devtinder.hemavasupalli.ca to get started."`,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Welcome to Dev Tinder 🚀",
          },
        },
        Source: process.env.SES_SOURCE_EMAIL, // must be verified in SES
      }
    };

    // utils/sanitizeUser.js

export function sanitizeUser(user) {
    if (!user) return null;
  
    return {
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailId: user?.emailId,
      age: user?.age,
      gender: user?.gender,
      about: user?.about,
      photoUrl: user?.photoUrl,
      skills: user?.skills,
      verified: user?.verified,
      lastSeen: user?.lastSeen,
      isOnline: user?.isOnline,
    };
  }
  
  