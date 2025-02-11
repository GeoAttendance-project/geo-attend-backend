import { promisify } from "util";
import dotenv from "dotenv";
import transport from "./smtpServerInitialization.js";
import { catchAsyncNormal } from "../../utils/catchAsyncNormal.js";
import studentRegistrationMailTemplate from "./studentRegistrationMailTemplate.js";
dotenv.config({});

const from = `"CSICE" <saran@csice.edu.in>`;

const sendMailAsync = promisify(transport.sendMail.bind(transport));

export const mailStudentUSernamePassword = catchAsyncNormal(
  async (email, name, username, password) => {
    const html = studentRegistrationMailTemplate(name, username, password);
    const mailOptions = {
      from,
      to: email,
      subject: "Student Login credentials!",
      html,
    };

    const resp = await sendMailAsync(mailOptions);
    console.log(
      `Student login credentials mail sent to ${email}. Message ID: ${resp.messageId}`
    );
  }
);
