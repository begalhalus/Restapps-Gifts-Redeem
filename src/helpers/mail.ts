import { Request, Response } from "express";
import * as nodemailer from "nodemailer";
const sender = process.env.MAIL_SENDER;
require("dotenv/config");

//config email
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

class Mail {
  public static sendMail = (
    email: string,
    activation: string,
    message: string,
    req: Request
  ): any => {
    let base_url = req.protocol + "://" + req.headers.host;
    let mailOptions: any;

    if (message == "otp") {
      mailOptions = {
        from: sender,
        to: email,
        subject: "OTP Akun " + process.env.APP_NAME,
        html:
          "Gunakan OTP tersebut untuk login ke dalam <b> Aplikasi " +
          process.env.APP_NAME +
          " </b>. <p> OTP Baru :<b> " +
          activation +
          " </b>",
      };
    }

    try {
      // sendmail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        return info.response;
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default Mail;
