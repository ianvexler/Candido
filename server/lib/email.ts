import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env["BREVO_SMTP_LOGIN"],
    pass: process.env["BREVO_SMTP_KEY"],
  },
});

const LOGO_CID = "candido-logo";

const getVerificationEmailHtml = (name: string, verificationUrl: string): string => {
  const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  const templatePath = path.join(baseDir, "templates", "verification-email.html");
  const template = fs.readFileSync(templatePath, "utf-8");

  return template
    .replace("{{LOGO_SRC}}", `cid:${LOGO_CID}`)
    .replace("{{NAME}}", name)
    .replace("{{VERIFICATION_URL}}", verificationUrl);
}

export const sendVerificationEmail = async (email: string, name: string, verificationUrl: string) => {
  const login = process.env["BREVO_SMTP_LOGIN"];
  if (!login || !process.env["BREVO_SMTP_KEY"]) {
    throw new Error("BREVO_SMTP_LOGIN and BREVO_SMTP_KEY must be set");
  }

  const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  const logoPath = path.join(baseDir, "assets", "logo.png");

  await transporter.sendMail({
    from: "Candido <no-reply@candidohq.com>",
    to: email,
    subject: "Verify your Candido account",
    html: getVerificationEmailHtml(name, verificationUrl),
    attachments: [
      {
        filename: "logo.png",
        content: fs.readFileSync(logoPath),
        cid: LOGO_CID,
      },
    ],
  });
}
