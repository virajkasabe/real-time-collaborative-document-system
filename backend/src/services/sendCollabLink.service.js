// emailService.js

const WEBSITE_ICON = 'https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png';

const stepOne = "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/1_xh7xs6.png"
const stepTwo = "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/2_hwzvpc.png"
const stepThree = "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182370/3_w5oyxc.png"
const stepFour = "https://res.cloudinary.com/qnf2f4fq/image/upload/v1786182371/4_lewr0f.png"

import { apiInstance, senderEmail } from './brevoClient.js';

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
    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Collaboration Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 60px; height: 60px; border-radius: 50%;">
            <h1 style="color: #2c3e50; margin-top: 10px;">Welcome to the Collaboration</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <p style="font-size: 18px;">Hello <strong>${recipientName}</strong>,</p>
            <p><strong>${inviterName}</strong> (<a href="mailto:${inviterEmail}">${inviterEmail}</a>) has invited you to collaborate on <strong>"${documentName}"</strong>.</p>
            <p>To get started, please complete your registration by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${registrationLink}" style="display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Complete Registration</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">${registrationLink}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <h3 style="color: #2c3e50;">How to get started:</h3>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 10px;">
                <img src="${stepOne}" alt="Step 1" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
                Click the registration link above
              </li>
              <li style="margin-bottom: 10px;">
                <img src="${stepTwo}" alt="Step 2" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
                Create your account with your email and password
              </li>
              <li style="margin-bottom: 10px;">
                <img src="${stepThree}" alt="Step 3" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
                Verify your email address
              </li>
              <li style="margin-bottom: 10px;">
                <img src="${stepFour}" alt="Step 4" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
                Start collaborating on "${documentName}"
              </li>
            </ol>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; font-size: 14px; color: #666;">
            <p><strong>Note:</strong> This invitation will expire in 7 days. If you have any questions, please contact <a href="mailto:${inviterEmail}">${inviterEmail}</a>.</p>
            <p style="margin-top: 10px;">This is an automated message, please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName
        }
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
      tags: ['registration', 'collaboration-invite']
    };

    // Send email
    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Registration invitation sent successfully to ${recipientEmail}`);
    return response;
    
  } catch (error) {
    console.error('Error sending registration invitation:', error);
    throw new Error(`Failed to send registration invitation: ${error.message}`);
  }
};

/**
 * Send collaboration join invitation email (for existing users)
 * @param {string} documentName - Name of the document
 * @param {string} inviterName - Name of the person inviting
 * @param {string} userEmail - Email of the existing user
 * @param {string} inviterEmail - Email of the inviter
 * @param {string} loginLink - Link to login and join
 * @returns {Promise} - API response
 */
export const joinCollab = async (
  documentName,
  inviterName,
  userEmail = null,
  inviterEmail = null,
  loginLink
) => {
  try {
    if (!userEmail) {
      throw new Error('User email is required');
    }

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Collaboration Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 60px; height: 60px; border-radius: 50%;">
            <h1 style="color: #2c3e50; margin-top: 10px;">Collaboration Invitation</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <p style="font-size: 18px;">Hello,</p>
            <p><strong>${inviterName}</strong> ${inviterEmail ? `(<a href="mailto:${inviterEmail}">${inviterEmail}</a>)` : ''} has invited you to collaborate on <strong>"${documentName}"</strong>.</p>
            <p>Click the button below to join and start collaborating:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginLink}" style="display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Join Collaboration</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">${loginLink}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <h3 style="color: #2c3e50;">What you can do:</h3>
            <ul style="padding-left: 20px; list-style: none;">
              <li style="margin-bottom: 10px;">
                <span style="display: inline-block; background: #3498db; color: white; width: 24px; height: 24px; text-align: center; line-height: 24px; border-radius: 50%; margin-right: 10px;">1</span>
                View and edit "${documentName}"
              </li>
              <li style="margin-bottom: 10px;">
                <span style="display: inline-block; background: #3498db; color: white; width: 24px; height: 24px; text-align: center; line-height: 24px; border-radius: 50%; margin-right: 10px;">2</span>
                Collaborate in real-time with team members
              </li>
              <li style="margin-bottom: 10px;">
                <span style="display: inline-block; background: #3498db; color: white; width: 24px; height: 24px; text-align: center; line-height: 24px; border-radius: 50%; margin-right: 10px;">3</span>
                Share feedback and suggestions
              </li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; font-size: 14px; color: #666;">
            <p><strong>Note:</strong> This invitation will expire in 7 days. If you have any questions, please contact ${inviterEmail || 'the inviter'}.</p>
            <p style="margin-top: 10px;">This is an automated message, please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    // Prepare email data for Brevo
    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail
      },
      to: [
        {
          email: userEmail,
          name: 'User'
        }
      ],
      subject: `Invitation to collaborate on "${documentName}" from ${inviterName}`,
      htmlContent: htmlContent,
      textContent: `
        Hello,
        
        ${inviterName} ${inviterEmail ? `(${inviterEmail})` : ''} has invited you to collaborate on "${documentName}".
        
        Join now by visiting: ${loginLink}
        
        What you can do:
        1. View and edit "${documentName}"
        2. Collaborate in real-time with team members
        3. Share feedback and suggestions
        
        Note: This invitation will expire in 7 days. If you have any questions, please contact ${inviterEmail || 'the inviter'}.
        
        This is an automated message, please do not reply to this email.
      `,
      tags: ['collaboration', 'existing-user-invite']
    };

    // Send email
    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Collaboration invitation sent successfully to ${userEmail}`);
    return response;
    
  } catch (error) {
    console.error('Error sending collaboration invitation:', error);
    throw new Error(`Failed to send collaboration invitation: ${error.message}`);
  }
};

/**
 * Send a generic invitation email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML content
 * @param {string} options.textContent - Plain text content
 * @param {Array} options.tags - Email tags
 * @param {Object} options.sender - Sender info (optional)
 * @returns {Promise} - API response
 */
export const sendCustomInvitation = async (options) => {
  try {
    const { to, subject, htmlContent, textContent, tags = [], sender = null } = options;
    
    if (!to || !subject || !htmlContent) {
      throw new Error('Missing required email parameters');
    }

    const emailData = {
      sender: sender || {
        name: 'Collaboration Platform',
        email: senderEmail
      },
      to: Array.isArray(to) ? to : [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent || 'View this email in HTML format for better experience.',
      tags: tags
    };

    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Custom email sent successfully to ${Array.isArray(to) ? to.map(t => t.email).join(', ') : to}`);
    return response;
    
  } catch (error) {
    console.error('Error sending custom email:', error);
    throw new Error(`Failed to send custom email: ${error.message}`);
  }
};

export default {
  registerAndJoinCollab,
  joinCollab,
  sendCustomInvitation
};