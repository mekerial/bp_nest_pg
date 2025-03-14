import * as nodemailer from "nodemailer";
import * as process from "process";
import { emailSubject } from "./email.manager";

const url = process.env.URL || "https://somesite.com/";

export const emailAdapter = {
  send() {},
  sendConfirmToEmail(email: string, confirmationCode: string) {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_16_PASSWORD,
      },
    });

    const info = transport.sendMail({
      from: process.env.emailSender,
      to: email,
      subject: emailSubject.confirmationRegistration,
      html: `
        <h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href= '${url}auth/registration-confirmation?code=${confirmationCode}'>complete registration</a>
        </p>
    `,
    });

    return info;
  },
  sendRecoveryPasswordToEmail(email: string, confirmationCode: string) {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_16_PASSWORD,
      },
    });

    const info = transport.sendMail({
      from: process.env.emailSender,
      to: email,
      subject: emailSubject.passwordRecovery,
      html: `
        <h1>Password recovery</h1>
        <p>To recovery password use this link:
        <a href='${url}auth/new-password?recoveryCode=${confirmationCode}'>password recovery</a>
        </p>`,
    });
    return info;
  },
};
