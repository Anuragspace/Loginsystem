import * as Brevo from "@getbrevo/brevo";

// Initialize Brevo API client
let apiInstance = null;

const getApiInstance = () => {
  if (!apiInstance) {
    apiInstance = new Brevo.TransactionalEmailsApi();
    // Set API key authentication
    apiInstance.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
  }
  return apiInstance;
};

/**
 * Send an email via Brevo HTTP API (works on Render — no SMTP needed)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const sendEmail = async (to, subject, html) => {
  console.log(`[Email] Attempting to send to: ${to}`);
  console.log(`[Email] BREVO_API_KEY set: ${process.env.BREVO_API_KEY ? "YES" : "NO"}`);
  console.log(`[Email] EMAIL_USER (sender): ${process.env.EMAIL_USER}`);

  const api = getApiInstance();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = {
    name: "AuthSystem",
    email: process.env.EMAIL_USER, // Must be a verified sender in Brevo
  };
  sendSmtpEmail.to = [{ email: to }];

  const response = await api.sendTransacEmail(sendSmtpEmail);
  console.log(`[Email] Sent successfully. Message ID: ${response.body?.messageId}`);
};

// Prevent malformed URLs if user accidentally includes pathnames in the ENV
const getCleanClientUrl = () => {
  let urlStr = process.env.CLIENT_URL || "http://localhost:5173";
  try {
    const parsed = new URL(urlStr);
    return parsed.origin;
  } catch (err) {
    return urlStr.replace(/\/login\/?$/, "").replace(/\/register\/?$/, "").replace(/\/$/, "");
  }
};

export const sendVerificationEmail = async (to, token) => {
  const baseUrl = getCleanClientUrl();
  const url = `${baseUrl}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border-radius: 12px; border: 1px solid #eee;">
      <div style="margin-bottom: 24px;">
        <div style="display: inline-block; background: #E8510A; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">AuthSystem</div>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #111;">Verify your email ✉️</h2>
      <p style="color: #555; margin-bottom: 24px; line-height: 1.6;">Click the button below to verify your email address and activate your account.</p>
      <a href="${url}" style="display: inline-block; background: #E8510A; color: white; padding: 13px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Verify Email →</a>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">If you didn't sign up, you can safely ignore this email.</p>
      <p style="color: #bbb; font-size: 12px;">This link expires in 24 hours.</p>
    </div>
  `;
  await sendEmail(to, "Verify your email — AuthSystem", html);
};

export const sendPasswordResetEmail = async (to, token) => {
  const baseUrl = getCleanClientUrl();
  const url = `${baseUrl}/reset-password/${token}`;
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border-radius: 12px; border: 1px solid #eee;">
      <div style="margin-bottom: 24px;">
        <div style="display: inline-block; background: #E8510A; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">AuthSystem</div>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #111;">Reset your password 🔑</h2>
      <p style="color: #555; margin-bottom: 24px; line-height: 1.6;">Click the button below to reset your password. This link is valid for <strong>1 hour</strong>.</p>
      <a href="${url}" style="display: inline-block; background: #E8510A; color: white; padding: 13px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password →</a>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;
  await sendEmail(to, "Password Reset Request — AuthSystem", html);
};
