import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const PROVIDER_CONFIG: Record<
  string,
  { host: string; port: number; secure: boolean }
> = {
  "gmail.com": { host: "smtp.gmail.com", port: 465, secure: true },
  "outlook.com": { host: "smtp.office365.com", port: 587, secure: false },
  "hotmail.com": { host: "smtp.office365.com", port: 587, secure: false },
  "live.com": { host: "smtp.office365.com", port: 587, secure: false },
  "yahoo.com": { host: "smtp.mail.yahoo.com", port: 465, secure: true },
};

declare global {
  var __greenCreditMailer: Transporter | undefined;
}

function resolveTransportOptions(user: string, pass: string): SMTPTransport.Options {
  const host = process.env.SMTP_HOST;
  const portValue = process.env.SMTP_PORT;
  const secureValue = process.env.SMTP_SECURE;

  if (host) {
    const port = Number(portValue || 587);
    const secure = secureValue ? secureValue === "true" : port === 465;

    return {
      host,
      port,
      secure,
      auth: { user, pass },
    };
  }

  const emailDomain = user.split("@")[1]?.toLowerCase() || "";
  const provider = PROVIDER_CONFIG[emailDomain];

  if (!provider) {
    throw new Error(
      "Unsupported email provider. Set SMTP_HOST, SMTP_PORT, and SMTP_SECURE in your .env for custom SMTP."
    );
  }

  return {
    ...provider,
    auth: { user, pass },
  };
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in your .env file.");
  }

  if (!global.__greenCreditMailer) {
    global.__greenCreditMailer = nodemailer.createTransport(resolveTransportOptions(user, pass));
  }

  return {
    transporter: global.__greenCreditMailer,
    user,
  };
}

interface SendOtpEmailOptions {
  name: string;
  otp: string;
  to: string;
}

export async function sendOtpEmail({ name, otp, to }: SendOtpEmailOptions) {
  const { transporter, user } = getTransporter();
  const from = process.env.EMAIL_FROM || user;
  const fromName = process.env.EMAIL_FROM_NAME || "Eco Credit";

  await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to,
    subject: "Verify your Eco Credit account",
    text: `Welcome to Eco Credit, ${name}! Your verification code is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937;">
        <h2 style="margin: 0 0 12px;">Welcome to Eco Credit, ${name}!</h2>
        <p style="margin: 0 0 16px;">Your verification code is below. It will expire in 5 minutes.</p>
        <div style="background: #f3f4f6; border-radius: 14px; padding: 20px; text-align: center;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #465fff;">
            ${otp}
          </span>
        </div>
        <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
