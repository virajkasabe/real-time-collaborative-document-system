import { apiInstance, senderEmail } from "./brevoClient.js";

const WEBSITE_ICON =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png";

const S = {
  fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`,
  body: `margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:#f0f4f8;`,
  wrapper: `background:#f0f4f8;padding:40px 20px;`,
  container: `max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.10);overflow:hidden;`,
  headerPurple: `background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:44px 32px 36px;text-align:center;`,
  headerGreen: `background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:44px 32px 36px;text-align:center;`,
  iconRing: `display:inline-block;width:72px;height:72px;background:rgba(255,255,255,0.18);border-radius:50%;line-height:72px;text-align:center;`,
  headerTitle: `color:#ffffff;margin:14px 0 0;font-size:26px;font-weight:700;letter-spacing:-0.5px;`,
  headerSub: `color:rgba(255,255,255,0.82);margin:6px 0 0;font-size:14px;font-weight:300;`,
  body2: `padding:36px 32px 28px;`,
  card: `background:#f8fafc;border-radius:14px;padding:22px;margin-bottom:20px;border:1px solid #e2e8f0;`,
  highlight: `background:linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%);border-radius:14px;padding:22px;margin-bottom:20px;border-left:4px solid #667eea;`,
  highlightGreen: `background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border-radius:14px;padding:22px;margin-bottom:20px;border-left:4px solid #10b981;`,
  stepBox: `background:#ffffff;border-radius:12px;padding:18px 22px;margin-bottom:14px;border:1px solid #e2e8f0;`,
  stepNum: `display:inline-block;width:30px;height:30px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;color:white;font-weight:700;font-size:13px;line-height:30px;text-align:center;margin-right:12px;vertical-align:middle;`,
  btnSuccess: `display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(16,185,129,0.35);`,
  btnDanger: `display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(239,68,68,0.35);`,
  btnPrimary: `display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(102,126,234,0.35);`,
  linkBox: `background:#f8fafc;border-radius:10px;padding:14px 18px;margin-top:20px;border:1px dashed #cbd5e1;`,
  linkText: `margin:4px 0;font-size:12px;color:#64748b;word-break:break-all;font-family:'Courier New',monospace;`,
  footer: `background:#f8fafc;padding:22px 32px;text-align:center;border-top:1px solid #e8edf4;`,
  footerText: `margin:0;font-size:12px;color:#94a3b8;line-height:1.8;`,
  expiry: `margin-top:20px;padding:14px 16px;background:#f1f5f9;border-radius:10px;text-align:center;font-size:13px;color:#64748b;`,
};

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>${S.fonts}</style>
</head>
<body style="${S.body}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${S.wrapper}">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="${S.container}">${content}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const registerAndJoinCollab = async (
  documentName,
  inviterName,
  acceptLink,
  declineLink,
  recipientEmail,
  inviterEmail,
  recipientName = null,
  registrationLink
) => {
  try {
    if (!recipientEmail) throw new Error("Recipient email is required");
    if (!registrationLink) throw new Error("Registration link is required");

    const content = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <!-- Header -->
        <tr><td style="${S.headerPurple}">
          <div style="${S.iconRing}">
            <img src="${WEBSITE_ICON}" alt="Icon" style="width:38px;height:38px;vertical-align:middle;" />
          </div>
          <h1 style="${S.headerTitle}">Collaboration Invitation</h1>
          <p style="${S.headerSub}">Complete registration to join the collaboration</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="${S.body2}">

          <!-- Document card -->
          <div style="${S.card}">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;">You've been invited to collaborate on</p>
            <h2 style="margin:6px 0 4px;font-size:22px;font-weight:700;color:#1a2332;">${documentName || "Untitled Document"}</h2>
            <p style="margin:6px 0 0;font-size:14px;color:#475569;">
              Invited by <strong style="color:#667eea;">${inviterName || "Someone"}</strong>
              ${inviterEmail ? `<span style="color:#94a3b8;"> · ${inviterEmail}</span>` : ""}
            </p>
          </div>

          <!-- Step 1 -->
          <div style="${S.highlight}">
            <h3 style="margin:0 0 10px;font-size:17px;font-weight:600;color:#4338ca;">📝 Step 1: Create Your Account</h3>
            <p style="margin:0 0 18px;font-size:14px;color:#1e293b;line-height:1.6;">
              You need to register first to access this collaboration. It only takes a minute!
            </p>
            <div style="text-align:center;">
              <a href="${registrationLink}" style="${S.btnPrimary}">Create Account →</a>
            </div>
          </div>

          <!-- Step 2 -->
          <div style="${S.stepBox}">
            <span style="${S.stepNum}">2</span>
            <span style="font-size:15px;font-weight:600;color:#1a2332;vertical-align:middle;">Join Collaboration</span>
            <p style="margin:6px 0 0 42px;font-size:13px;color:#64748b;">After registration, accept this invitation to start collaborating</p>
          </div>

          <!-- Action buttons -->
          <div style="text-align:center;margin:28px 0 20px;">
            <a href="${registrationLink}" style="${S.btnSuccess}">✅ Register &amp; Accept</a>
            &nbsp;&nbsp;
            <a href="${declineLink}" style="${S.btnDanger}">✕ Decline</a>
            <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">Click "Register &amp; Accept" to create your account and join immediately</p>
          </div>

          <!-- Links -->
          <div style="${S.linkBox}">
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#475569;">🔗 Quick Links</p>
            <p style="${S.linkText}"><strong>Register:</strong> ${registrationLink}</p>
            ${acceptLink ? `<p style="${S.linkText}"><strong>Accept (after registration):</strong> ${acceptLink}</p>` : ""}
            <p style="${S.linkText}"><strong>Decline:</strong> ${declineLink}</p>
          </div>

          ${
            recipientName
              ? `
          <div style="margin-top:14px;padding:10px 14px;background:#eef2ff;border-radius:8px;">
            <p style="margin:0;font-size:13px;color:#4338ca;">👤 <strong>Invited as:</strong> ${recipientName}</p>
          </div>`
              : ""
          }

          <div style="${S.expiry}">⏰ This invitation will expire in <strong>7 days</strong></div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="${S.footer}">
          <p style="${S.footerText}">© ${new Date().getFullYear()} Collaboration Platform · Automated notification</p>
        </td></tr>
      </table>`;

    const emailHtml = emailWrapper(content);

    const response = await apiInstance.transactionalEmails.sendTransacEmail({
      to: [
        {
          email: recipientEmail,
          name: recipientName || recipientEmail.split("@")[0],
        },
      ],
      subject: `✨ Join "${documentName || "Document"}" — Registration Required | Invited by ${inviterName || "Someone"}`,
      htmlContent: emailHtml,
      sender: {
        name: inviterName || "Collaboration System",
        email: inviterEmail || senderEmail,
      },
    });

    console.log("✅ Registration invitation sent to:", recipientEmail);
    return { success: true, message: "Invitation sent", response };
  } catch (error) {
    console.error("❌ Error sending invitation:", error);
    throw new Error(`Failed to send invitation: ${error.message}`);
  }
};

export const joinCollab = async (
  documentName,
  inviterName,
  acceptLink,
  declineLink,
  userEmail = null,
  inviterEmail = null,
  loginLink
) => {
  try {
    if (!loginLink) throw new Error("Login link is required");

    const content = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <!-- Header -->
        <tr><td style="${S.headerGreen}">
          <div style="${S.iconRing}">
            <img src="${WEBSITE_ICON}" alt="Icon" style="width:38px;height:38px;vertical-align:middle;" />
          </div>
          <h1 style="${S.headerTitle}">Login Required</h1>
          <p style="${S.headerSub}">Please login to join the collaboration</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="${S.body2}">

          <!-- User card -->
          <div style="${S.card}">
            <div style="text-align:center;margin-bottom:10px;">
              <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;line-height:56px;font-size:24px;">👤</div>
            </div>
            <p style="margin:0;text-align:center;font-size:15px;font-weight:600;color:#065f46;">${userEmail || "User"}</p>
            <p style="margin:4px 0 0;text-align:center;font-size:13px;color:#047857;">Login required to access collaboration</p>
          </div>

          <!-- Document details -->
          <div style="${S.card}">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e8edf4;font-size:14px;color:#64748b;">📄 Document</td>
                <td style="padding:8px 0;border-bottom:1px solid #e8edf4;font-size:14px;font-weight:600;color:#1a2332;text-align:right;">${documentName || "Untitled Document"}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#64748b;">👋 Invited by</td>
                <td style="padding:8px 0;font-size:14px;font-weight:500;color:#667eea;text-align:right;">${inviterName || "Unknown"}${inviterEmail ? ` <span style="color:#94a3b8;font-size:12px;">(${inviterEmail})</span>` : ""}</td>
              </tr>
            </table>
          </div>

          <!-- Step 1 -->
          <div style="${S.highlightGreen}">
            <h3 style="margin:0 0 10px;font-size:17px;font-weight:600;color:#065f46;">🔐 Step 1: Login to Your Account</h3>
            <p style="margin:0 0 18px;font-size:14px;color:#1e293b;line-height:1.6;">
              Please login to your existing account to join this collaboration.
            </p>
            <div style="text-align:center;">
              <a href="${loginLink}" style="${S.btnSuccess}">🔑 Login Now</a>
            </div>
          </div>

          <!-- Step 2 -->
          <div style="${S.stepBox}">
            <span style="${S.stepNum}">2</span>
            <span style="font-size:15px;font-weight:600;color:#1a2332;vertical-align:middle;">Join Collaboration</span>
            <p style="margin:6px 0 0 42px;font-size:13px;color:#64748b;">After login, you'll be able to join this collaboration</p>
          </div>

          <!-- Action buttons -->
          <div style="text-align:center;margin:28px 0 20px;">
            <a href="${loginLink}" style="${S.btnSuccess}">✅ Login &amp; Join</a>
            &nbsp;&nbsp;
            <a href="${declineLink}" style="${S.btnDanger}">✕ Decline</a>
          </div>

          <!-- Links -->
          <div style="${S.linkBox}">
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#475569;">🔗 Quick Links</p>
            <p style="${S.linkText}"><strong>Login:</strong> ${loginLink}</p>
            <p style="${S.linkText}"><strong>Join (after login):</strong> ${acceptLink}</p>
            <p style="${S.linkText}"><strong>Decline:</strong> ${declineLink}</p>
          </div>

          <div style="margin-top:14px;padding:10px 14px;background:#eef2ff;border-radius:8px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#4338ca;">✨ Login required to access collaboration features</p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="${S.footer}">
          <p style="${S.footerText}">© ${new Date().getFullYear()} Collaboration Platform · Automated notification</p>
        </td></tr>
      </table>`;

    const emailHtml = emailWrapper(content);

    const response = await apiInstance.transactionalEmails.sendTransacEmail({
      to: [
        {
          email: userEmail || senderEmail,
          name: userEmail ? userEmail.split("@")[0] : "Admin",
        },
      ],
      subject: `🔐 Login Required: Join "${documentName || "Document"}" — Invited by ${inviterName || "Someone"}`,
      htmlContent: emailHtml,
      sender: { name: "Collaboration System", email: senderEmail },
    });

    console.log("✅ Login notification sent to:", userEmail || senderEmail);
    return {
      success: true,
      message: "Login required to join",
      loginRequired: true,
      loginLink,
    };
  } catch (error) {
    console.error("❌ Error sending join notification:", error);
    throw new Error(`Failed to process join request: ${error.message}`);
  }
};
