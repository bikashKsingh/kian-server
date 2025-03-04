const nodemailer = require("nodemailer");

module.exports.sendOTPEmail = async ({
  emailTo,
  subject,
  name = "Guest",
  otp,
}) => {
  try {
    // Create Transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER_NAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      // from: process.env.EMAIL_FROM, // sender address
      from: process.env.EMAIL_FROM, // sender address
      to: emailTo, // list of receivers
      subject: subject, // Subject line
      // text: text, // plain text body
      html: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
      <div style='margin:50px auto;width:70%;padding:20px 0'>
        <div style='border-bottom:1px solid #eee'>
          <a href='' style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>Code Scroller</a>
        </div>
        <p style='font-size:1.1em'>Hi, <b> ${name} </b> </p>
        <p>This is your OTP</p>
        <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${otp}</h2>
        <p style='font-size:0.9em;'>Regards,<br />Code Scroller</p>
        <hr style='border:none;border-top:1px solid #eee' />
        <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
          <p>Code Scroller</p>
          <p>Ford Company Chowk</p>
          <p>Purnia</p>
        </div>
      </div>
    </div>`, // html body
    });

    return {
      status: true,
      msgId: info.messageId,
      message: "Message Send Successfully",
    };
  } catch (error) {
    // console.log("Helper Error", error.message);
    return { status: false, msgId: null, message: error.message };
  }
};

module.exports.createOTP = function () {
  min = 1000;
  max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
