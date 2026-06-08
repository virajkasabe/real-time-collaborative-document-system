import { BrevoClient } from '@getbrevo/brevo'
import { ENV } from '../config/ENV.js';

const apiInstance = new BrevoClient({
  apiKey : ENV.BREVO_API_KEY
})

export const registerAndJoinCollab = async (documentName, inviterName, acceptLink, declineLink, recipientEmail, inviterEmail, recipientName = null, registrationLink) => {
  try {
    // Validate required fields
    if (!recipientEmail) {
      throw new Error('Recipient email is required');
    }
    if (!registrationLink) {
      throw new Error('Registration link is required');
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Collaboration Invitation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <tr>
            <td align="center" style="padding: 50px 20px;">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                <!-- Header with gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; line-height: 60px; margin-bottom: 20px;">
                      <span style="font-size: 30px;">🤝</span>
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Collaboration Invitation</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Complete registration to join</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin-bottom: 25px; border-radius: 8px;">
                      <p style="margin: 0; font-size: 16px; color: #333;">
                        <strong style="color: #667eea;">${inviterName || 'Someone'}</strong>
                        has invited you to collaborate on
                        <strong style="color: #764ba2;">${documentName || 'a document'}</strong>
                      </p>
                    </div>

                    <!-- Step 1: Register First -->
                    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                      <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 30px; height: 30px; background: #2196f3; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <span style="color: white; font-size: 16px; font-weight: bold; line-height: 1;">1</span>
                  </div>
                        <h3 style="margin: 0; color: #1565c0; font-size: 18px;">Register Your Account</h3>
                      </div>
                      <p style="margin: 0 0 15px 0; color: #0d47a1; font-size: 14px;">You need to create an account first to access this collaboration.</p>
                      <div style="text-align: center;">
                        <a href="${registrationLink}" style="display: inline-block; padding: 12px 35px; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(33,150,243,0.4);">
                          📝 Register Now
                        </a>
                      </div>
                    </div>

                    <!-- Step 2: Then Join -->
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px; opacity: 0.8;">
                      <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 30px; height: 30px; background: #9e9e9e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">
                      <span style="color: white; font-size: 16px; font-weight: bold; line-height: 1;">2</span>
                    </div>
                        <h3 style="margin: 0; color: #616161; font-size: 18px;">Join Collaboration</h3>
                      </div>
                      <p style="margin: 0; color: #757575; font-size: 14px;">After registration, you'll be able to accept this collaboration invitation.</p>
                    </div>

                    <!-- Action Buttons -->
                   <div style="text-align: center; margin: 30px 0 20px;">
                    <div style="display: flex; gap: 15px; justify-content: center; flex-direction: row; flex-wrap: wrap;">
                      <a href="${registrationLink}" style="display: block; padding: 14px 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; text-align: center; min-width: 200px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ✅ Register & Accept
                      </a>
                      <a href="${declineLink}" style="display: block; padding: 14px 30px; background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; text-align: center; min-width: 200px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ❌ Decline
                      </a>
                    </div>
                  </div>

                    <p style="text-align: center; font-size: 12px; color: #666; margin: 15px 0;">
                      ⚡ Click "Register & Accept" to create your account and join immediately
                    </p>

                    <!-- Divider -->
                    <div style="border-top: 1px solid #e0e0e0; margin: 25px 0;"></div>

                    <!-- Direct Links Section -->
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">🔗 Quick Links:</p>
                      <p style="margin: 5px 0; font-size: 11px; color: #333;">
                        <strong>Register:</strong> ${registrationLink}
                      </p>
                      ${acceptLink ? `<p style="margin: 5px 0; font-size: 11px; color: #999;">Accept (after registration): ${acceptLink}</p>` : ''}
                      <p style="margin: 5px 0; font-size: 11px; color: #333;">
                        <strong>Decline:</strong> ${declineLink}
                      </p>
                    </div>

                    ${recipientName ? `
                    <div style="background: #e3f2fd; padding: 12px 15px; border-radius: 8px; margin-top: 15px;">
                      <p style="margin: 0; font-size: 13px; color: #1976d2;">
                        👤 <strong>Invited for:</strong> ${recipientName}
                      </p>
                    </div>
                    ` : ''}

                    <!-- Footer Note -->
                    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #666;">⏰ This invitation will expire in 7 days</p>
                      <p style="margin: 5px 0 0 0; font-size: 11px; color: #999;">Registration required before joining the collaboration</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 11px; color: #999;">
                      &copy; ${new Date().getFullYear()} Collaboration Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailData = {
      to: [{
        email: recipientEmail,
        name: recipientName || recipientEmail.split('@')[0]
      }],
      subject: `✨ Join ${documentName || 'document'} - Registration Required | Invitation from ${inviterName || 'Someone'}`,
      htmlContent: emailHtml,
      sender: {
        name: inviterName || 'Collab System',
        email: inviterEmail || ENV.BREVO_SENDER_EMAIL
      }
    };

    console.log("emailData", emailData);

    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log("Invitation sent successfully", response);

    return { success: true, message: 'Invitation sent', response };
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw new Error(`Failed to send invitation: ${error.message}`);
  }
};

export const joinCollab = async (documentName, inviterName, acceptLink, declineLink, userEmail = null, inviterEmail = null, loginLink) => {
  try {
    // Validate required fields
    if (!ENV.ADMIN_EMAIL) {
      throw new Error('Admin email not configured');
    }
    if (!loginLink) {
      throw new Error('Login link is required');
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Join Notification</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: #f0f2f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f0f2f5;">
          <tr>
            <td align="center" style="padding: 50px 20px;">
              <table width="100%" max-width="550" cellpadding="0" cellspacing="0" border="0" style="max-width: 550px; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden;">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 35px 30px; text-align: center;">
                    <div style="width: 65px; height: 65px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; line-height: 65px; margin-bottom: 15px;">
                      <span style="font-size: 32px;">🔐</span>
                    </div>
                    <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Action Required: Login First</h2>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Please login to join the collaboration</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px 30px;">
                    <!-- User Info Card -->
                    <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: #4CAF50; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                          <span style="font-size: 24px; color: white;">👤</span>
                        </div>
                      </div>
                      <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: 700; color: #2e7d32; text-align: center;">
                        ${userEmail || 'User'}
                      </p>
                      <p style="margin: 0; font-size: 13px; color: #1b5e20; text-align: center;">Login required to access collaboration</p>
                    </div>

                    <!-- Collaboration Details -->
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 0; overflow: hidden; margin-bottom: 20px;">
                      <div style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                        <p style="margin: 0; font-size: 13px; color: #666;">📄 Document:</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600; color: #333;">${documentName || 'a document'}</p>
                      </div>
                      <div style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                        <p style="margin: 0; font-size: 13px; color: #666;">👋 Invited by:</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 500; color: #667eea;">${inviterName || 'Unknown'}</p>
                        ${inviterEmail ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${inviterEmail}</p>` : ''}
                      </div>
                    </div>

                    <!-- Login Required Section -->
                    <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                      <div style="text-align: center; margin-bottom: 15px;">
                        <span style="font-size: 40px;">🔑</span>
                      </div>
                      <h3 style="text-align: center; color: #e65100; margin: 0 0 10px 0;">Login Required</h3>
                      <p style="text-align: center; color: #bf360c; font-size: 14px; margin-bottom: 20px;">
                        Please login to your account first to join this collaboration
                      </p>
                      <div style="text-align: center;">
                        <a href="${loginLink}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(255,152,0,0.4);">
                          🔐 Login Now
                        </a>
                      </div>
                    </div>

                    <!-- Step 2: Then Join -->
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px; opacity: 0.8;">
                      <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 30px; height: 30px; background: #9e9e9e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">
                          <span style="color: white; font-size: 16px; font-weight: bold;">2</span>
                        </div>
                        <h3 style="margin: 0; color: #616161; font-size: 18px;">Join Collaboration</h3>
                      </div>
                      <p style="margin: 0; color: #757575; font-size: 14px;">After successful login, you'll be able to join this collaboration.</p>
                    </div>

                    <!-- Action Buttons -->
                    <div style="text-align: center; margin-top: 25px;">
                      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <a href="${loginLink}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px;">
                          ✅ Login & Join
                        </a>
                        <a href="${declineLink}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px;">
                          🚫 Decline
                        </a>
                      </div>
                    </div>

                    <!-- Direct Links Section -->
                    <div style="margin-top: 25px; padding: 12px; background: #fff3e0; border-radius: 8px;">
                      <p style="margin: 0 0 5px 0; font-size: 11px; color: #666;">🔗 Quick Links:</p>
                      <p style="margin: 2px 0; font-size: 10px; color: #333; word-break: break-all;">
                        <strong>Login:</strong> ${loginLink}
                      </p>
                      <p style="margin: 2px 0; font-size: 10px; color: #333; word-break: break-all;">
                        <strong>Join (after login):</strong> ${acceptLink}
                      </p>
                      <p style="margin: 2px 0; font-size: 10px; color: #333; word-break: break-all;">
                        <strong>Decline:</strong> ${declineLink}
                      </p>
                    </div>

                    <!-- Stats Badge -->
                    <div style="margin-top: 20px; padding: 12px; background: #e3f2fd; border-radius: 8px; text-align: center;">
                      <span style="font-size: 12px; color: #1976d2;">✨ Login required to access collaboration features ✨</span>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 11px; color: #999;">
                      Automated notification from Collaboration System
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #bbb;">
                      Please login first to join this collaboration
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #bbb;">
                      Powered by Brevo
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailData = {
      to: [{
        email: ENV.ADMIN_EMAIL,
        name: 'Admin'
      }],
      subject: `🔐 Login Required: ${userEmail || 'User'} wants to join ${documentName || 'document'}`,
      htmlContent: emailHtml,
      sender: {
        name: 'Collab System',
        email: ENV.BREVO_SENDER_EMAIL
      }
    };

    console.log("Join notification emailData", emailData);

    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log("Join notification sent successfully", response);

    return { success: true, message: 'Login required to join', loginRequired: true, loginLink };
  } catch (error) {
    console.error('Error sending join notification:', error);
    throw new Error(`Failed to process join request: ${error.message}`);
  }
};
