import { OTPSERVICECOLORS as C } from "../utils/helper.js";
import { apiInstance, senderEmail, senderName } from "./brevoClient.js";

const WEBSITE_ICON =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png";

const emailShell = (bodyContent, title = "Email Verification") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { margin:0; padding:0; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; background:${C.background}; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.background};padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="background:${C.cardBg};border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.10);overflow:hidden;">
          ${bodyContent}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const header = (icon, title, subtitle) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background:linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%);padding:44px 32px 36px;text-align:center;">
      <div style="display:inline-block;width:72px;height:72px;background:rgba(255,255,255,0.18);border-radius:50%;line-height:72px;text-align:center;font-size:32px;">${icon}</div>
      <h1 style="color:#ffffff;margin:14px 0 0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${title}</h1>
      <p style="color:rgba(255,255,255,0.82);margin:6px 0 0;font-size:14px;font-weight:300;">${subtitle}</p>
    </td></tr>
  </table>`;

const footer = (senderLabel) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background:#f8fafc;padding:22px 32px;text-align:center;border-top:1px solid ${C.border};">
      <p style="margin:0;font-size:12px;color:${C.textMuted};line-height:1.8;">
        If you didn't request this, please ignore this email.<br>
        © ${new Date().getFullYear()} ${senderLabel}. All rights reserved.
      </p>
    </td></tr>
  </table>`;

export const otpService = async (otp, email, options = {}) => {
  try {
    const {
      senderEmail: customSenderEmail,
      senderName: customSenderName,
      subject = "Your OTP Verification Code",
      expiryMinutes = 15,
      templateId = null,
      link = null,
      includeBranding = true,
    } = options;

    const finalSenderEmail =
      customSenderEmail || senderEmail || "noreply@yourdomain.com";
    const finalSenderName = customSenderName || senderName || "Your App Name";

    const emailData = {
      sender: { email: finalSenderEmail, name: finalSenderName },
      to: [{ email }],
      subject,
    };

    if (templateId) {
      emailData.templateId = templateId;
      emailData.params = { OTP: otp, LINK: link || "", EXPIRY: expiryMinutes };
    } else {
      const bodyContent = `
              ${includeBranding ? header("🔐", "Email Verification", "Verify your identity to continue") : ""}

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="padding:36px 32px 28px;">

                  <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:${C.text};text-align:center;">
                    Verify Your Email Address
                  </h2>
                  <p style="margin:0 0 28px;font-size:15px;color:${C.textLight};text-align:center;line-height:1.6;">
                    Use the One-Time Password below to complete your verification.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:linear-gradient(135deg,${C.background},#f3f4f6);border-radius:14px;padding:28px 20px;margin:0 0 24px;border:2px dashed ${C.primaryLight};text-align:center;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:${C.textLight};letter-spacing:1px;text-transform:uppercase;">Your OTP Code</p>
                    <div style="display:inline-block;background:#ffffff;border-radius:10px;padding:16px 28px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid ${C.border};">
                      <span style="font-size:44px;font-weight:700;letter-spacing:14px;color:${C.primary};font-family:'Courier New',monospace;">${otp}</span>
                    </div>
                  </div>

                  <!-- Expiry -->
                  <div style="background:#fffbeb;border-left:4px solid ${C.warning};border-radius:0 10px 10px 0;padding:13px 18px;margin-bottom:20px;">
                    <p style="margin:0;font-size:14px;color:#92400e;">
                      ⏱️ This OTP is valid for <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.
                    </p>
                  </div>

                  ${
                    link
                      ? `
                  <!-- Verify button -->
                  <div style="text-align:center;margin:24px 0;">
                    <a href="${link}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,${C.secondary},#059669);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                      ✅ Verify Email Now
                    </a>
                  </div>`
                      : ""
                  }

                  <!-- Security note -->
                  <div style="background:#eff6ff;border-left:4px solid ${C.primary};border-radius:0 10px 10px 0;padding:13px 18px;margin-bottom:20px;">
                    <p style="margin:0;font-size:13px;color:#1e3a8a;">
                      🔒 Never share this OTP with anyone. Our team will never ask for this code.
                    </p>
                  </div>

                </td></tr>
              </table>

              ${includeBranding ? footer(finalSenderName) : ""}`;

      emailData.htmlContent = emailShell(bodyContent, "OTP Verification");
      emailData.textContent = `
Email Verification

Your OTP code: ${otp}

Valid for ${expiryMinutes} minutes.
${link ? `Verify here: ${link}` : ""}

Never share this OTP with anyone.
If you didn't request this, please ignore this email.
${includeBranding ? `\n© ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.` : ""}`;
    }

    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    return {
      success: true,
      data: response.data,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("OTP Service Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      message: "Failed to send OTP",
    };
  }
};

export const emailVerifyLinkService = async (link, email, options = {}) => {
  try {
    const {
      senderEmail: customSenderEmail,
      senderName: customSenderName,
      subject = "Verify Your Email Address",
      includeBranding = true,
      expiryHours = 24,
    } = options;

    const finalSenderEmail =
      customSenderEmail || senderEmail || "noreply@yourdomain.com";
    const finalSenderName = customSenderName || senderName || "Your App Name";

    const bodyContent = `
          ${includeBranding ? header("📧", "Verify Your Email", "One last step to complete your registration") : ""}

          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:36px 32px 28px;">

              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:${C.text};text-align:center;">One More Step!</h2>
              <p style="margin:0 0 28px;font-size:15px;color:${C.textLight};text-align:center;line-height:1.6;">
                Please verify your email address to complete your registration and start using our services.
              </p>

              <!-- Verify button -->
              <div style="text-align:center;margin:28px 0;">
                <a href="${link}" style="display:inline-block;padding:15px 48px;background:linear-gradient(135deg,${C.primary},${C.primaryDark});color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;box-shadow:0 4px 16px rgba(79,70,229,0.35);">
                  ✅ Verify My Email
                </a>
              </div>

              <!-- Fallback link -->
              <div style="background:${C.background};border-radius:10px;padding:14px 18px;margin-bottom:20px;border:1px solid ${C.border};">
                <p style="margin:0 0 6px;font-size:12px;color:${C.textLight};">Or copy this link into your browser:</p>
                <code style="display:block;font-size:12px;color:${C.primary};word-break:break-all;background:#ffffff;padding:8px 10px;border-radius:6px;border:1px solid ${C.border};">${link}</code>
              </div>

              <!-- Expiry -->
              <div style="background:#fffbeb;border-left:4px solid ${C.warning};border-radius:0 10px 10px 0;padding:13px 18px;margin-bottom:20px;">
                <p style="margin:0;font-size:14px;color:#92400e;">
                  ⏱️ This verification link will expire in <strong>${expiryHours} hours</strong>.
                </p>
              </div>

              <!-- Why verify -->
              <div style="background:#eff6ff;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${C.primary};">Why verify your email?</p>
                <ul style="margin:0;padding-left:18px;font-size:13px;color:${C.textLight};line-height:1.9;">
                  <li>Secure your account against unauthorized access</li>
                  <li>Receive important notifications and updates</li>
                  <li>Reset your password if you forget it</li>
                  <li>Access all features of our platform</li>
                </ul>
              </div>

            </td></tr>
          </table>

          ${includeBranding ? footer(finalSenderName) : ""}`;

    const response = await apiInstance.transactionalEmails.sendTransacEmail({
      sender: { email: finalSenderEmail, name: finalSenderName },
      to: [{ email }],
      subject,
      htmlContent: emailShell(bodyContent, "Email Verification"),
      textContent: `
Email Verification

Please verify your email address to complete your registration.

Verify here: ${link}

This link expires in ${expiryHours} hours.

Why verify?
- Secure your account
- Receive notifications
- Reset your password
- Access all features

If you didn't create an account, please ignore this email.
${includeBranding ? `\n© ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.` : ""}`,
    });

    return {
      success: true,
      data: response.data,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error(
      "Email Verification Link Service Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data || error.message,
      message: "Failed to send verification email",
    };
  }
};
