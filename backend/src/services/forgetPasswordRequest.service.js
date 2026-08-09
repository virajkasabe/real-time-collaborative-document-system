import { apiInstance, senderEmail, senderName } from "./brevoClient.js";

const WEBSITE_ICON =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png";

export const forgetPasswordService = async (
  forgetPasswordRequestUrl,
  email
) => {
  try {
    const response = await apiInstance.transactionalEmails.sendTransacEmail({
      sender: { email: senderEmail, name: senderName },
      to: [{ email }],
      subject: "🔑 Reset Your Password",
      htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width,initial-scale=1.0">
                      <title>Password Reset</title>
                      <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                        body { margin:0; padding:0; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; background:#f0f4f8; }
                        a { color:#667eea; }
                        @media only screen and (max-width:480px) {
                          .container { padding:28px 20px !important; }
                          .btn { padding:13px 28px !important; font-size:15px !important; }
                        }
                      </style>
                    </head>
                    <body>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4f8;padding:40px 20px;">
                        <tr><td align="center">
                          <table width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0" border="0">
                            <tr><td style="background:#ffffff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.10);overflow:hidden;">

                              <!-- Header -->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr><td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:44px 32px 36px;text-align:center;">
                                  <div style="display:inline-block;width:72px;height:72px;background:rgba(255,255,255,0.18);border-radius:50%;line-height:72px;text-align:center;">
                                    <img src="${WEBSITE_ICON}" alt="Icon" style="width:38px;height:38px;vertical-align:middle;" />
                                  </div>
                                  <h1 style="color:#ffffff;margin:14px 0 0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Reset Your Password</h1>
                                  <p style="color:rgba(255,255,255,0.82);margin:6px 0 0;font-size:14px;font-weight:300;">Secure your account in just a few clicks</p>
                                </td></tr>
                              </table>

                              <!-- Body -->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="container" style="padding:36px 32px 28px;">
                                <tr><td>

                                  <!-- Greeting -->
                                  <p style="margin:0 0 6px;font-size:16px;color:#1f2937;">Hello there!</p>
                                  <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
                                    We received a request to reset the password for your account associated with
                                    <strong style="color:#667eea;">${email}</strong>.
                                  </p>

                                  <!-- Info box -->
                                  <div style="background:#f8fafc;border-left:4px solid #667eea;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:28px;">
                                    <p style="margin:0;font-size:14px;font-weight:600;color:#1f2937;">🔑 Quick Action Required</p>
                                    <p style="margin:8px 0 0;font-size:14px;color:#475569;">Click the button below to create a new, secure password for your account.</p>
                                  </div>

                                  <!-- CTA Button -->
                                  <div style="text-align:center;margin:32px 0;">
                                    <a href="${forgetPasswordRequestUrl}" class="btn" style="display:inline-block;padding:15px 44px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:16px;box-shadow:0 4px 16px rgba(102,126,234,0.40);letter-spacing:0.3px;">
                                      Reset Password
                                    </a>
                                  </div>

                                  <!-- Important notes -->
                                  <div style="background:#fff5f5;border-left:4px solid #ef4444;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:20px;">
                                    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937;">⚠️ Important Notes</p>
                                    <ul style="margin:0;padding-left:18px;font-size:14px;color:#475569;line-height:1.8;">
                                      <li>This link will expire in <strong style="color:#ef4444;">1 hour</strong></li>
                                      <li>This link can only be used <strong>once</strong></li>
                                      <li>The link becomes invalid after use</li>
                                    </ul>
                                  </div>

                                  <!-- Security tip -->
                                  <div style="background:#eef2ff;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                                    <p style="margin:0;font-size:13px;color:#4338ca;">
                                      🛡️ <strong>Security Tip:</strong> Always use a strong, unique password. Never share your reset link with anyone.
                                    </p>
                                  </div>

                                  <!-- Didn't request -->
                                  <p style="font-size:14px;color:#64748b;line-height:1.6;">
                                    If you didn't request this password reset, you can safely ignore this email.
                                    Your password will remain unchanged.
                                  </p>

                                  <!-- Fallback link -->
                                  <div style="background:#f8fafc;border-radius:10px;padding:14px 18px;margin-top:20px;border:1px dashed #cbd5e1;">
                                    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#475569;">🔗 Or copy this link into your browser:</p>
                                    <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;font-family:'Courier New',monospace;">${forgetPasswordRequestUrl}</p>
                                  </div>

                                </td></tr>
                              </table>

                              <!-- Footer -->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr><td style="background:#f8fafc;padding:22px 32px;text-align:center;border-top:1px solid #e8edf4;">
                                  <span style="display:inline-block;padding:4px 14px;background:#dcfce7;color:#166534;border-radius:50px;font-size:12px;font-weight:600;margin-bottom:10px;">🔒 Secure Connection</span>
                                  <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.8;">
                                    This is an automated message. If you need help, contact our support team.<br>
                                    © ${new Date().getFullYear()} Collaboration Platform. All rights reserved.
                                  </p>
                                </td></tr>
                              </table>

                            </td></tr>
                          </table>
                        </td></tr>
                      </table>
                    </body>
                    </html>`,
      textContent: `
              PASSWORD RESET REQUEST
              ======================

              Hello there!

              We received a request to reset the password for your account: ${email}

              Click the link below to reset your password:
              ${forgetPasswordRequestUrl}

              Important:
              - This link expires in 1 hour
              - Can only be used once
              - Becomes invalid after use

              If you didn't request this, please ignore this email.

              © ${new Date().getFullYear()} Collaboration Platform. All rights reserved.`,
    });

    return {
      success: true,
      data: response.data,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data || error.message,
      message: "Failed to send password reset email",
    };
  }
};
