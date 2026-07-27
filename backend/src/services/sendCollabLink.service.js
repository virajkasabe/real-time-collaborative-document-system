import { apiInstance, senderEmail } from './brevoClient.js';

// Define the icon URL once at the top
const WEBSITE_ICON = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png';

// Shared styles for both email templates
const STYLES = {
  fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`,
  body: `margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f6f9;`,
  container: `max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); overflow: hidden;`,
  header: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px 40px; text-align: center;`,
  headerTitle: `color: #ffffff; margin: 16px 0 0 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;`,
  headerSubtitle: `color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 15px; font-weight: 300;`,
  iconWrapper: `width: 72px; height: 72px; background: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);`,
  content: `padding: 40px 32px 32px;`,
  card: `background: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #e8edf4;`,
  cardTitle: `margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a2332;`,
  cardText: `margin: 0; font-size: 14px; line-height: 1.6; color: #475569;`,
  highlightBox: `background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;`,
  stepBox: `background: #ffffff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e8edf4; display: flex; align-items: flex-start; gap: 16px;`,
  stepNumber: `min-width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;`,
  buttonPrimary: `display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);`,
  buttonSuccess: `display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);`,
  buttonDanger: `display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);`,
  buttonOutline: `display: inline-block; padding: 14px 36px; background: transparent; color: #667eea; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; border: 2px solid #667eea;`,
  linkBox: `background: #f8fafc; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border: 1px dashed #cbd5e1;`,
  linkText: `margin: 4px 0; font-size: 12px; color: #64748b; word-break: break-all; font-family: 'Courier New', monospace;`,
  footer: `background: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e8edf4;`,
  footerText: `margin: 0; font-size: 12px; color: #94a3b8;`,
  badge: `display: inline-block; padding: 6px 14px; background: #eef2ff; color: #667eea; border-radius: 50px; font-size: 12px; font-weight: 500;`,
};

// Helper function to generate the email wrapper
const generateEmailWrapper = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaboration Invitation</title>
    <style>${STYLES.fonts}</style>
  </head>
  <body style="${STYLES.body}">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f6f9; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="${STYLES.container}">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

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
    // Validate required fields
    if (!recipientEmail) {
      throw new Error('Recipient email is required');
    }
    if (!registrationLink) {
      throw new Error('Registration link is required');
    }

    const emailContent = `
      <!-- Header -->
      <tr>
        <td style="${STYLES.header}">
          <div style="${STYLES.iconWrapper}">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 40px; height: 40px; object-fit: contain;" />
          </div>
          <h1 style="${STYLES.headerTitle}">Collaboration Invitation</h1>
          <p style="${STYLES.headerSubtitle}">Complete registration to join the collaboration</p>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="${STYLES.content}">
          <!-- Invitation Card -->
          <div style="${STYLES.card}">
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">You've been invited to collaborate</p>
            <h2 style="margin: 8px 0 4px 0; font-size: 22px; font-weight: 700; color: #1a2332;">${documentName || 'Untitled Document'}</h2>
            <p style="margin: 8px 0 0 0; font-size: 15px; color: #475569;">
              <span style="font-weight: 600; color: #667eea;">${inviterName || 'Someone'}</span>
              <span style="color: #94a3b8;">•</span>
              <span style="color: #64748b;">Invited you to join</span>
            </p>
            ${inviterEmail ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">${inviterEmail}</p>` : ''}
          </div>

          <!-- Step 1: Register -->
          <div style="${STYLES.highlightBox}">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span style="font-size: 24px;">📝</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #4338ca;">Step 1: Create Your Account</h3>
            </div>
            <p style="margin: 0 0 20px 0; font-size: 15px; color: #1e293b; line-height: 1.6;">
              You need to register first to access this collaboration. It only takes a minute!
            </p>
            <div style="text-align: center;">
              <a href="${registrationLink}" style="${STYLES.buttonPrimary}">
                Create Account →
              </a>
            </div>
          </div>

          <!-- Step 2: Join -->
          <div style="${STYLES.stepBox}">
            <div style="${STYLES.stepNumber}">2</div>
            <div>
              <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a2332;">Join Collaboration</h4>
              <p style="margin: 0; font-size: 14px; color: #64748b;">After registration, you'll be able to accept this invitation</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 32px 0 24px;">
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="${registrationLink}" style="${STYLES.buttonSuccess}">
                ✅ Register & Accept
              </a>
              <a href="${declineLink}" style="${STYLES.buttonDanger}">
                ✕ Decline
              </a>
            </div>
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #94a3b8;">
              ⚡ Click "Register & Accept" to create your account and join immediately
            </p>
          </div>

          <!-- Quick Links -->
          <div style="${STYLES.linkBox}">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">🔗 Quick Links</p>
            <p style="${STYLES.linkText}"><strong>Register:</strong> ${registrationLink}</p>
            ${acceptLink ? `<p style="${STYLES.linkText}"><strong>Accept (after registration):</strong> ${acceptLink}</p>` : ''}
            <p style="${STYLES.linkText}"><strong>Decline:</strong> ${declineLink}</p>
          </div>

          ${recipientName ? `
            <div style="margin-top: 16px; padding: 12px 16px; background: #eef2ff; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px; color: #4338ca;">
                👤 <strong>Invited as:</strong> ${recipientName}
              </p>
            </div>
          ` : ''}

          <!-- Footer Note -->
          <div style="margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 12px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">⏰ This invitation will expire in 7 days</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Registration required before joining the collaboration</p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="${STYLES.footer}">
          <p style="${STYLES.footerText}">
            © ${new Date().getFullYear()} Collaboration Platform
          </p>
          <p style="${STYLES.footerText}" style="margin-top: 4px; font-size: 11px; color: #cbd5e1;">
            This is an automated notification from the Collaboration System
          </p>
        </td>
      </tr>
    `;

    const emailHtml = generateEmailWrapper(emailContent);

    const emailData = {
      to: [{
        email: recipientEmail,
        name: recipientName || recipientEmail.split('@')[0]
      }],
      subject: `✨ Join "${documentName || 'Document'}" - Registration Required | Invitation from ${inviterName || 'Someone'}`,
      htmlContent: emailHtml,
      sender: {
        name: inviterName || 'Collaboration System',
        email: inviterEmail || senderEmail
      }
    };

    console.log('📧 Sending registration invitation to:', recipientEmail);
    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log('✅ Invitation sent successfully');

    return { success: true, message: 'Invitation sent', response };
  } catch (error) {
    console.error('❌ Error sending invitation:', error);
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
    if (!loginLink) {
      throw new Error('Login link is required');
    }

    const emailContent = `
      <!-- Header -->
      <tr>
        <td style="${STYLES.header}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <div style="${STYLES.iconWrapper}">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 40px; height: 40px; object-fit: contain;" />
          </div>
          <h1 style="${STYLES.headerTitle}">Login Required</h1>
          <p style="${STYLES.headerSubtitle}">Please login to join the collaboration</p>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="${STYLES.content}">
          <!-- User Profile Card -->
          <div style="${STYLES.card}" style="text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <span style="font-size: 28px; color: white;">👤</span>
            </div>
            <h3 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 600; color: #065f46;">${userEmail || 'User'}</h3>
            <p style="margin: 0; font-size: 14px; color: #047857;">Login required to access collaboration</p>
          </div>

          <!-- Document Details -->
          <div style="${STYLES.card}">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e8edf4;">
              <span style="font-size: 14px; color: #64748b;">📄 Document</span>
              <span style="font-size: 14px; font-weight: 600; color: #1a2332;">${documentName || 'Untitled Document'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="font-size: 14px; color: #64748b;">👋 Invited by</span>
              <span style="font-size: 14px; font-weight: 500; color: #667eea;">${inviterName || 'Unknown'}</span>
            </div>
            ${inviterEmail ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="font-size: 13px; color: #94a3b8;">Email</span>
                <span style="font-size: 13px; color: #64748b;">${inviterEmail}</span>
              </div>
            ` : ''}
          </div>

          <!-- Login Required Section -->
          <div style="${STYLES.highlightBox}" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left-color: #f59e0b;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span style="font-size: 28px;">🔐</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #92400e;">Step 1: Login to Your Account</h3>
            </div>
            <p style="margin: 0 0 20px 0; font-size: 15px; color: #78350f; line-height: 1.6;">
              Please login to your existing account to join this collaboration.
            </p>
            <div style="text-align: center;">
              <a href="${loginLink}" style="${STYLES.buttonPrimary}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                🔑 Login Now
              </a>
            </div>
          </div>

          <!-- Step 2: Join -->
          <div style="${STYLES.stepBox}">
            <div style="${STYLES.stepNumber}" style="background: #94a3b8;">2</div>
            <div>
              <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a2332;">Join Collaboration</h4>
              <p style="margin: 0; font-size: 14px; color: #64748b;">After login, you'll be able to join this collaboration</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 32px 0 24px;">
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="${loginLink}" style="${STYLES.buttonSuccess}">
                ✅ Login & Join
              </a>
              <a href="${declineLink}" style="${STYLES.buttonDanger}">
                ✕ Decline
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div style="${STYLES.linkBox}">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">🔗 Quick Links</p>
            <p style="${STYLES.linkText}"><strong>Login:</strong> ${loginLink}</p>
            <p style="${STYLES.linkText}"><strong>Join (after login):</strong> ${acceptLink}</p>
            <p style="${STYLES.linkText}"><strong>Decline:</strong> ${declineLink}</p>
          </div>

          <!-- Info Badge -->
          <div style="margin-top: 24px; padding: 12px 16px; background: #eef2ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #4338ca;">
              ✨ Login required to access collaboration features
            </p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="${STYLES.footer}">
          <p style="${STYLES.footerText}">
            © ${new Date().getFullYear()} Collaboration Platform
          </p>
          <p style="${STYLES.footerText}" style="margin-top: 4px; font-size: 11px; color: #cbd5e1;">
            Automated notification from the Collaboration System
          </p>
          <p style="${STYLES.footerText}" style="margin-top: 2px; font-size: 11px; color: #cbd5e1;">
            Powered by Brevo
          </p>
        </td>
      </tr>
    `;

    const emailHtml = generateEmailWrapper(emailContent);

    const emailData = {
      to: [{
        email: userEmail || senderEmail,
        name: userEmail ? userEmail.split('@')[0] : 'Admin'
      }],
      subject: `🔐 Login Required: ${userEmail || 'User'} wants to join "${documentName || 'Document'}"`,
      htmlContent: emailHtml,
      sender: {
        name: 'Collaboration System',
        email: senderEmail
      }
    };

    console.log('📧 Sending login notification to:', userEmail || senderEmail);
    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log('✅ Login notification sent successfully');

    return { success: true, message: 'Login required to join', loginRequired: true, loginLink };
  } catch (error) {
    console.error('❌ Error sending join notification:', error);
    throw new Error(`Failed to process join request: ${error.message}`);
  }
};