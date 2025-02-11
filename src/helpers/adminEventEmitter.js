import EventEmitter from "node:events";

import { mailStudentUSernamePassword } from "../utils/email/emailService.js";
import { catchAsyncNormal } from "../utils/catchAsyncNormal.js";

const eventEmitter = new EventEmitter();

eventEmitter.on(
  "send_username_password_student",
  catchAsyncNormal(async (email, name, username, password) => {
    await mailStudentUSernamePassword(email, name, username, password);
  })
);

export default eventEmitter;
