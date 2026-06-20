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
const FEEDBACK_RECIPIENT_EMAIL = "no-reply@candidohq.com";

const getBaseDir = () => path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const getLogoAttachment = () => ({
  filename: "logo.png",
  content: fs.readFileSync(path.join(getBaseDir(), "assets", "logo.png")),
  cid: LOGO_CID,
});

const loadTemplate = (name: string, replacements: Record<string, string>): string => {
  let html = fs.readFileSync(path.join(getBaseDir(), "templates", `${name}.html`), "utf-8");
  html = html.replace("{{LOGO_SRC}}", `cid:${LOGO_CID}`);
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(`{{${key}}}`, value);
  }
  return html;
};

const requireEmailConfig = () => {
  if (!process.env["BREVO_SMTP_LOGIN"] || !process.env["BREVO_SMTP_KEY"]) {
    throw new Error("BREVO_SMTP_LOGIN and BREVO_SMTP_KEY must be set");
  }
};

const sendTemplateEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string>
) => {
  requireEmailConfig();
  await transporter.sendMail({
    from: "Candido <no-reply@candidohq.com>",
    to,
    subject,
    html: loadTemplate(templateName, replacements),
    attachments: [getLogoAttachment()],
  });
};

export const sendVerificationEmail = async (email: string, name: string, verificationUrl: string) => {
  await sendTemplateEmail(email, "Verify your Candido account", "verification-email", {
    NAME: name,
    VERIFICATION_URL: verificationUrl,
  });
};

export const sendNewFeedbackEmail = async (
  username: string,
  category: string,
  title: string,
  content: string
) => {
  await sendTemplateEmail(FEEDBACK_RECIPIENT_EMAIL, "New feedback entry", "new-feedback-email", {
    USERNAME: username,
    CATEGORY: category,
    TITLE: title,
    CONTENT: content,
  });
};