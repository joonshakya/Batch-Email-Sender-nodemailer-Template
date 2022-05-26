require("dotenv").config();
const nodemailer = require("nodemailer");

const personList = require("./list.js");
const emailText = require("./text.js");
const emailHTML = require("./email.js");
const EMAIL_SUBJECT = "Hello World 2";
const SENDER_FULL_NAME = process.env.SENDER_FULL_NAME || "Your Name";

const GMAIL_EMAIL = process.env.GMAIL_EMAIL || "Gmail email";
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "Gmail password"; // if you have 2FA enabled, you'll need to use app specific credentials

const PARALLEL_LIMIT = 3;

let i = 0;
let j = 0;
const sendMail = async (config, i, length) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"${SENDER_FULL_NAME}" <${GMAIL_EMAIL}>`,
    ...config,
  });
  j++;
  console.log(`${j}/${length} emails sent. #${i}`);
};

(async () => {
  while (i < personList.length) {
    await Promise.all(
      [...Array(PARALLEL_LIMIT)].map(async (_) => {
        if (i < personList.length) {
          const config = {
            to: personList[i].email, // list of receivers
            subject: EMAIL_SUBJECT, // Subject line
            text: emailText,
            html: emailHTML,
          };
          i++;
          await sendMail(config, i, personList.length);
        }
      })
    );
  }
})();
