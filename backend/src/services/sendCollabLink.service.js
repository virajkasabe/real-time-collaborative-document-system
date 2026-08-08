// emailService.js

const WEBSITE_ICON =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png";

const stepOne =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/1_xh7xs6.png";
const stepTwo =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/2_hwzvpc.png";
const stepThree =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182370/3_w5oyxc.png";
const stepFour =
  "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/4_lewr0f.png";

import { apiInstance, senderEmail } from "./brevoClient.js";

/**
 * Send registration and collaboration invitation email
 * @param {string} documentName - Name of the document
 * @param {string} inviterName - Name of the person inviting
 * @param {string} recipientEmail - Email of the recipient
 * @param {string} inviterEmail - Email of the inviter
 * @param {string} recipientName - Name of the recipient (default: "User")
 * @param {string} registrationLink - Link for registration
 * @returns {Promise} - API response
 */
export const registerAndJoinCollab = async (
  documentName,
  inviterName,
  recipientEmail,
  inviterEmail,
  recipientName = "User",
  registrationLink
) => {
  try {
    // Generate HTML content with full-width steps
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Collaboration Invitation</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 10px !important; }
              .step-image { width: 100% !important; height: auto !important; }
              .step-container { padding: 15px !important; }
              .button { width: 100% !important; display: block !important; text-align: center !important; }
            }
            .step-image {
              width: 100%;
              max-width: 600px;
              height: auto;
              display: block;
              margin: 10px auto;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .step-container {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin: 15px 0;
            }
            .step-item {
              margin-bottom: 25px;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .step-item:last-child {
              margin-bottom: 0;
            }
            .step-label {
              background: #3498db;
              color: white;
              padding: 8px 16px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              border-radius: 0 0 4px 0;
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: 0 auto; padding: 20px; background: #f5f7fa;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; background: white; padding: 30px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 70px; height: 70px; border-radius: 50%; margin-bottom: 10px;">
            <h1 style="color: #2c3e50; margin: 10px 0 5px; font-size: 28px;">Welcome to Collaboration</h1>
            <p style="color: #7f8c8d; font-size: 16px;">You've been invited to join a project</p>
          </div>
          
          <!-- Invitation Content -->
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="font-size: 18px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
            <p><strong>${inviterName}</strong> (<a href="mailto:${inviterEmail}" style="color: #3498db; text-decoration: none;">${inviterEmail}</a>) has invited you to collaborate on <strong style="color: #2c3e50;">"${documentName}"</strong>.</p>
            <p>To get started, please complete your registration by clicking the button below:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${registrationLink}" style="display: inline-block; background: #3498db; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);">Complete Registration</a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
            <p style="background: #f5f7fa; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; border: 1px solid #e0e0e0;">${registrationLink}</p>
          </div>
          
          <!-- Steps Section - Full Width Images -->
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h2 style="color: #2c3e50; text-align: center; margin-top: 0; margin-bottom: 25px; font-size: 24px;">📋 How to Get Started</h2>
            
            <!-- Step 1 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #3498db; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 1</span>
              </div>
              <img src="${stepOne}" alt="Step 1: Click the registration link" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Click the notification bell icon</p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #2ecc71; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 2</span>
              </div>
              <img src="${stepTwo}" alt="Step 2: Create your account" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Click all notification</p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #f39c12; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 3</span>
              </div>
              <img src="${stepThree}" alt="Step 3: Verify your email" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Click ✔️for Accespt || ❌ for Declined</p>
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #e74c3c; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 4</span>
              </div>
              <img src="${stepFour}" alt="Step 4: Start collaborating" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">check on home on "${documentName}" with your team</p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: white; padding: 25px; border-radius: 12px; font-size: 13px; color: #666; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin-top: 0;"><strong>⏰ Note:</strong> This invitation will expire in 7 days.</p>
            <p>If you have any questions, please contact <a href="mailto:${inviterEmail}" style="color: #3498db; text-decoration: none;">${inviterEmail}</a></p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 15px 0;">
            <p style="margin-bottom: 0; font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
          </div>
          
        </body>
      </html>
    `;

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail,
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject: `Invitation to collaborate on "${documentName}" from ${inviterName}`,
      htmlContent: htmlContent,
      textContent: `
        Hello ${recipientName},
        
        ${inviterName} (${inviterEmail}) has invited you to collaborate on "${documentName}".
        
        To get started, please complete your registration by visiting: ${registrationLink}
        
        Steps to get started:
        1. Click the registration link above
        2. Create your account with your email and password
        3. Verify your email address
        4. Start collaborating on "${documentName}"
        
        Note: This invitation will expire in 7 days. If you have any questions, please contact ${inviterEmail}.
        
        This is an automated message, please do not reply to this email.
      `,
      tags: ["registration", "collaboration-invite"],
    };

    // Send email
    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(
      `Registration invitation sent successfully to ${recipientEmail}`
    );
    return response;
  } catch (error) {
    console.error("Error sending registration invitation:", error);
    throw new Error(`Failed to send registration invitation: ${error.message}`);
  }
};

export const joinCollab = async (
  documentName,
  inviterName,
  userEmail = null,
  inviterEmail = null,
  loginLink
) => {
  try {
    if (!userEmail) {
      throw new Error("User email is required");
    }

    // Generate HTML content with full-width steps
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Collaboration Invitation</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 10px !important; }
              .step-image { width: 100% !important; height: auto !important; }
              .step-container { padding: 15px !important; }
              .button { width: 100% !important; display: block !important; text-align: center !important; }
            }
            .step-image {
              width: 100%;
              max-width: 600px;
              height: auto;
              display: block;
              margin: 10px auto;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .step-container {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              margin: 15px 0;
            }
            .step-item {
              margin-bottom: 25px;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .step-item:last-child {
              margin-bottom: 0;
            }
            .step-label {
              background: #3498db;
              color: white;
              padding: 8px 16px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              border-radius: 0 0 4px 0;
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: 0 auto; padding: 20px; background: #f5f7fa;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; background: white; padding: 30px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 70px; height: 70px; border-radius: 50%; margin-bottom: 10px;">
            <h1 style="color: #2c3e50; margin: 10px 0 5px; font-size: 28px;">Collaboration Invitation</h1>
            <p style="color: #7f8c8d; font-size: 16px;">Join your team on an exciting project</p>
          </div>
          
          <!-- Invitation Content -->
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="font-size: 18px; margin-top: 0;">Hello,</p>
            <p><strong>${inviterName}</strong> ${inviterEmail ? `(<a href="mailto:${inviterEmail}" style="color: #3498db; text-decoration: none;">${inviterEmail}</a>)` : ""} has invited you to collaborate on <strong style="color: #2c3e50;">"${documentName}"</strong>.</p>
            <p>Click the button below to join and start collaborating:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginLink}" style="display: inline-block; background: #27ae60; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(39, 174, 96, 0.3);">Join Collaboration</a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
            <p style="background: #f5f7fa; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; border: 1px solid #e0e0e0;">${loginLink}</p>
          </div>
          
          <!-- Steps Section - Full Width Images -->
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h2 style="color: #2c3e50; text-align: center; margin-top: 0; margin-bottom: 25px; font-size: 24px;">🚀 How to Join & Collaborate</h2>
            
            <!-- Step 1 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #3498db; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 1</span>
              </div>
              <img src="${stepOne}" alt="Step 1: Click the join button" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Click the "Join Collaboration" button above</p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #2ecc71; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 2</span>
              </div>
              <img src="${stepTwo}" alt="Step 2: Log in to your account" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Log in to your existing account</p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #f39c12; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 3</span>
              </div>
              <img src="${stepThree}" alt="Step 3: Access the document" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Access "${documentName}" and review the content</p>
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="step-item">
              <div style="background: #f8f9fa; padding: 5px 15px;">
                <span class="step-label" style="background: #e74c3c; color: white; padding: 6px 15px; display: inline-block; font-weight: bold; font-size: 13px; border-radius: 0 0 6px 6px;">STEP 4</span>
              </div>
              <img src="${stepFour}" alt="Step 4: Start collaborating" class="step-image" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
              <div style="padding: 12px 20px; background: #f8f9fa;">
                <p style="margin: 0; font-weight: 500;">Start collaborating in real-time with your team</p>
              </div>
            </div>
          </div>
          
          <!-- Features -->
          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="color: #2c3e50; margin-top: 0; text-align: center;">✨ What you can do</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">
                  <span style="font-size: 20px;">📝</span> View and edit "${documentName}"
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">
                  <span style="font-size: 20px;">👥</span> Collaborate in real-time with team members
                </td>
              </tr>
              <tr>
                <td style="padding: 10px;">
                  <span style="font-size: 20px;">💬</span> Share feedback and suggestions
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Footer -->
          <div style="background: white; padding: 25px; border-radius: 12px; font-size: 13px; color: #666; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin-top: 0;"><strong>⏰ Note:</strong> This invitation will expire in 7 days.</p>
            <p>If you have any questions, please contact ${inviterEmail ? `<a href="mailto:${inviterEmail}" style="color: #3498db; text-decoration: none;">${inviterEmail}</a>` : "the inviter"}</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 15px 0;">
            <p style="margin-bottom: 0; font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
          </div>
          
        </body>
      </html>
    `;

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail,
      },
      to: [
        {
          email: userEmail,
          name: "User",
        },
      ],
      subject: `Invitation to collaborate on "${documentName}" from ${inviterName}`,
      htmlContent: htmlContent,
      textContent: `
        Hello,
        
        ${inviterName} ${inviterEmail ? `(${inviterEmail})` : ""} has invited you to collaborate on "${documentName}".
        
        Join now by visiting: ${loginLink}
        
        Steps to join:
        1. Click the join link above
        2. Log in to your account
        3. Access "${documentName}"
        4. Start collaborating with your team
        
        What you can do:
        - View and edit "${documentName}"
        - Collaborate in real-time with team members
        - Share feedback and suggestions
        
        Note: This invitation will expire in 7 days. If you have any questions, please contact ${inviterEmail || "the inviter"}.
        
        This is an automated message, please do not reply to this email.
      `,
      tags: ["collaboration", "existing-user-invite"],
    };

    // Send email
    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Collaboration invitation sent successfully to ${userEmail}`);
    return response;
  } catch (error) {
    console.error("Error sending collaboration invitation:", error);
    throw new Error(
      `Failed to send collaboration invitation: ${error.message}`
    );
  }
};

export const sendCustomInvitation = async (options) => {
  try {
    const {
      to,
      subject,
      htmlContent,
      textContent,
      tags = [],
      sender = null,
    } = options;

    if (!to || !subject || !htmlContent) {
      throw new Error("Missing required email parameters");
    }

    const emailData = {
      sender: sender || {
        name: "Collaboration Platform",
        email: senderEmail,
      },
      to: Array.isArray(to) ? to : [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent:
        textContent || "View this email in HTML format for better experience.",
      tags: tags,
    };

    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(
      `Custom email sent successfully to ${Array.isArray(to) ? to.map((t) => t.email).join(", ") : to}`
    );
    return response;
  } catch (error) {
    console.error("Error sending custom email:", error);
    throw new Error(`Failed to send custom email: ${error.message}`);
  }
};

export default {
  registerAndJoinCollab,
  joinCollab,
  sendCustomInvitation,
};
