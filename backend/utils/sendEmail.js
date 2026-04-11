import nodemailer from "nodemailer";

// Reuse a single transporter instance for better performance
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      // Use explicit host + port 465 (SSL) instead of service:'gmail'
      // Port 587 (STARTTLS) is often blocked by cloud providers like Render
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465 (SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return transporter;
};

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
const sendEmail = async (to, subject, html) => {
  const t = getTransporter();

  // Log env values to help debug (without exposing the full password)
  console.log(`[Email] Attempting to send to: ${to}`);
  console.log(`[Email] Using EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`[Email] EMAIL_PASS set: ${process.env.EMAIL_PASS ? 'YES' : 'NO'}`);

  const mailOptions = {
    from: `"AuthSystem" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await t.sendMail(mailOptions);
  console.log(`[Email] Message sent successfully. ID: ${info.messageId}`);
};

// Prevent malformed URLs if user accidentally includes pathnames in the ENV
const getCleanClientUrl = () => {
  let urlStr = process.env.CLIENT_URL || "http://localhost:5173";
  // Attempt to parse standard URL and return just origin, fallback to basic regex strip
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
