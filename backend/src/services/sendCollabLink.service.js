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

// Shared styles for better consistency
const baseStyles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a2e;
    max-width: 640px;
    margin: 0 auto;
    padding: 20px;
    background: #f0f2f5;
  `,
  card: `
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  `,
  header: `
    text-align: center;
    margin-bottom: 30px;
  `,
  stepItem: `
    margin-bottom: 24px;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e8ecf1;
    transition: box-shadow 0.2s;
  `,
  stepLabel: (color = "#4a6cf7") => `
    background: ${color};
    color: white;
    padding: 6px 16px;
    display: inline-block;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.5px;
    border-radius: 0 0 6px 6px;
  `,
  button: (bg = "#4a6cf7") => `
    display: inline-block;
    background: ${bg};
    color: white;
    padding: 14px 40px;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 17px;
    box-shadow: 0 4px 14px rgba(74, 108, 247, 0.3);
    transition: transform 0.1s, box-shadow 0.2s;
  `,
  image: `
    width: 100%;
    max-width: 600px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  `,
};

// Helper to generate full email wrapper
const createEmailWrapper = (content, title = "") => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || "Collaboration Invitation"}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { padding: 12px !important; }
          .card { padding: 20px !important; }
          .step-image { width: 100% !important; height: auto !important; }
          .button { width: 100% !important; display: block !important; text-align: center !important; padding: 14px 20px !important; }
          .flex-row { flex-direction: column !important; }
          .gap-10 { gap: 8px !important; }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          ${baseStyles.container}
        }
        .card {
          ${baseStyles.card}
        }
        .step-item {
          ${baseStyles.stepItem}
        }
        .step-item:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
        .step-image {
          ${baseStyles.image}
        }
        .button {
          ${baseStyles.button()}
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
        }
        .button-green {
          background: #10b981;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .button-green:hover {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        .flex-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .gap-10 {
          gap: 10px;
        }
        .method-box {
          background: #f8fafc;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          flex: 1;
          min-width: 180px;
        }
        .method-box:hover {
          border-color: #4a6cf7;
          background: #f1f4ff;
        }
        .badge {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-orange { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fce4ec; color: #b71c1c; }
        .divider {
          border: none;
          border-top: 1px dashed #d1d5db;
          margin: 12px 0;
        }
        .note-box {
          background: #f0f7ff;
          padding: 12px 16px;
          border-radius: 6px;
          border-left: 4px solid #4a6cf7;
          font-size: 13px;
          color: #1e293b;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }
        .feature-item {
          background: #f8fafc;
          padding: 14px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e8ecf1;
        }
        @media only screen and (max-width: 600px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
        .footer {
          font-size: 13px;
          color: #64748b;
        }
        .footer a {
          color: #4a6cf7;
          text-decoration: none;
        }
        .footer hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 16px 0;
        }
        .text-center { text-align: center; }
        .text-muted { color: #64748b; }
        .font-bold { font-weight: 700; }
        .mt-8 { margin-top: 8px; }
        .mt-16 { margin-top: 16px; }
        .mb-8 { margin-bottom: 8px; }
        .mb-16 { margin-bottom: 16px; }
        .inline-block { display: inline-block; }
        .w-full { width: 100%; }
        .break-all { word-break: break-all; }
      </style>
    </head>
    <body>
      ${content}
    </body>
  </html>
`;

// Common header component
const createHeader = () => `
  <div class="card" style="text-align: center;">
    <img src="${WEBSITE_ICON}" alt="Website Icon" style="width: 72px; height: 72px; border-radius: 50%; margin-bottom: 12px; border: 3px solid #e8ecf1;">
    <h1 style="color: #1a1a2e; margin: 8px 0 4px; font-size: 28px; font-weight: 700;">Welcome to Collaboration</h1>
    <p style="color: #64748b; font-size: 16px;">Join your team and start working together</p>
  </div>
`;

// Footer component
const createFooter = (inviterEmail = null) => `
  <div class="card footer">
    <p><strong>⏰ Note:</strong> This invitation will expire in 7 days.</p>
    <p>If you have any questions, please contact ${inviterEmail ? `<a href="mailto:${inviterEmail}">${inviterEmail}</a>` : "the inviter"}</p>
    <hr>
    <p style="margin-bottom: 0; font-size: 12px; color: #94a3b8;">This is an automated message, please do not reply to this email.</p>
  </div>
`;

// Registration steps component
const createRegistrationSteps = () => `
  <div class="card">
    <h2 style="color: #1a1a2e; text-align: center; margin-top: 0; margin-bottom: 24px; font-size: 22px;">📝 How to Register</h2>
    
    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-blue">STEP 1</span>
      </div>
      <div style="padding: 16px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 600; font-size: 15px;">Choose your registration method</p>
        <div class="flex-row gap-10" style="margin-top: 12px;">
          <div class="method-box">
            <strong>📧 Email Registration</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #334155;">
              <li>Full Name</li>
              <li>Email <span style="color: #94a3b8; font-size: 12px;">(use email where you got collab)</span></li>
              <li>Password</li>
              <li>Confirm Password</li>
            </ul>
          </div>
          <div class="method-box">
            <strong>🔵 Google Registration</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #334155;">
              <li>Sign up with Google</li>
              <li>No password needed</li>
              <li>One-click registration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-green">STEP 2</span>
      </div>
      <div style="padding: 16px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 600; font-size: 15px;">Verify your email</p>
        <div style="margin-top: 12px; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span class="badge badge-blue" style="white-space: nowrap;">Step A</span>
            <div>
              <strong>Click the verification link</strong>
              <p style="margin: 4px 0 0; font-size: 14px; color: #475569;">Open your email inbox and click the verification link</p>
            </div>
          </div>
          <hr class="divider">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span class="badge badge-orange" style="white-space: nowrap;">Step B</span>
            <div>
              <strong>Enter the OTP</strong>
              <p style="margin: 4px 0 0; font-size: 14px; color: #475569;">Copy the OTP from the verification link and paste it to complete verification</p>
              <div class="note-box" style="margin-top: 8px;">
                <strong>Note:</strong> The verification link contains your OTP — both are required to complete registration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-red">STEP 3</span>
      </div>
      <div style="padding: 16px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 600; font-size: 15px;">Login to your account</p>
        <div style="margin-top: 12px; background: white; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155;">
            <li><strong>Email</strong> — Enter your registered email</li>
            <li><strong>Password</strong> — Enter your password</li>
            <li style="margin-top: 6px; color: #64748b; font-style: italic;">Or continue with Google if you registered that way</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
`;

// Collaboration steps component
const createCollaborationSteps = (documentName) => `
  <div class="card">
    <h2 style="color: #1a1a2e; text-align: center; margin-top: 0; margin-bottom: 24px; font-size: 22px;">📋 How to Get Started</h2>
    
    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-blue">STEP 1</span>
      </div>
      <img src="${stepOne}" alt="Step 1: Click the notification bell" class="step-image">
      <div style="padding: 12px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 500;">Click the notification bell icon</p>
      </div>
    </div>
    
    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-green">STEP 2</span>
      </div>
      <img src="${stepTwo}" alt="Step 2: View notifications" class="step-image">
      <div style="padding: 12px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 500;">Click all notification</p>
      </div>
    </div>
    
    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-orange">STEP 3</span>
      </div>
      <img src="${stepThree}" alt="Step 3: Accept or decline" class="step-image">
      <div style="padding: 12px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 500;">Click ✔️ for Accept or ❌ for Declined</p>
      </div>
    </div>
    
    <div class="step-item">
      <div style="background: #f8fafc; padding: 4px 16px;">
        <span class="badge badge-red">STEP 4</span>
      </div>
      <img src="${stepFour}" alt="Step 4: Start collaborating" class="step-image">
      <div style="padding: 12px 20px; background: #f8fafc;">
        <p style="margin: 0; font-weight: 500;">Check on home on "<strong>${documentName}</strong>" with your team</p>
      </div>
    </div>
  </div>
`;

export const registerAndJoinCollab = async (
  documentName,
  inviterName,
  recipientEmail,
  inviterEmail,
  recipientName = "User",
  registrationLink
) => {
  try {
    const htmlContent = createEmailWrapper(`
      ${createHeader()}
      
      <!-- Invitation Content -->
      <div class="card">
        <p style="font-size: 18px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
        <p><strong>${inviterName}</strong> (<a href="mailto:${inviterEmail}" style="color: #4a6cf7; text-decoration: none;">${inviterEmail}</a>) has invited you to collaborate on <strong style="color: #1a1a2e;">"${documentName}"</strong>.</p>
        <p>To get started, please complete your registration by clicking the button below:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a
            href="${registrationLink}"
            style="
              display: inline-block;
              background-color: #ffffff;
              color: #333333;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              border: 1px solid #dddddd;
            "
          >
            Complete Registration
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
        <p style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; word-break: break-all; font-size: 13px; border: 1px solid #e2e8f0; color: #334155;">${registrationLink}</p>
      </div>

      ${createRegistrationSteps()}
      ${createCollaborationSteps(documentName)}
      ${createFooter(inviterEmail)}
    `, "Collaboration Invitation");

    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail,
      },
      to: [{ email: recipientEmail, name: recipientName }],
      subject: `Invitation to collaborate on "${documentName}" from ${inviterName}`,
      htmlContent,
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

    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Registration invitation sent successfully to ${recipientEmail}`);
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

    const htmlContent = createEmailWrapper(`
      ${createHeader()}
      
      <!-- Invitation Content -->
      <div class="card">
        <p style="font-size: 18px; margin-top: 0;">Hello,</p>
        <p><strong>${inviterName}</strong> ${inviterEmail ? `(<a href="mailto:${inviterEmail}" style="color: #4a6cf7; text-decoration: none;">${inviterEmail}</a>)` : ""} has invited you to collaborate on <strong style="color: #1a1a2e;">"${documentName}"</strong>.</p>
        <p>Click the button below to join and start collaborating:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginLink}" class="button button-green">Join Collaboration</a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
        <p style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; word-break: break-all; font-size: 13px; border: 1px solid #e2e8f0; color: #334155;">${loginLink}</p>
      </div>
      
      ${createCollaborationSteps(documentName)}
      
      <!-- Features -->
      <div class="card">
        <h3 style="color: #1a1a2e; margin-top: 0; text-align: center; font-size: 18px;">✨ What you can do</h3>
        <div class="feature-grid">
          <div class="feature-item">
            <span style="font-size: 24px;">📝</span>
            <p style="margin: 4px 0 0; font-weight: 500;">View and edit "${documentName}"</p>
          </div>
          <div class="feature-item">
            <span style="font-size: 24px;">👥</span>
            <p style="margin: 4px 0 0; font-weight: 500;">Real-time collaboration</p>
          </div>
          <div class="feature-item" style="grid-column: 1 / -1;">
            <span style="font-size: 24px;">💬</span>
            <p style="margin: 4px 0 0; font-weight: 500;">Share feedback and suggestions</p>
          </div>
        </div>
      </div>
      
      ${createFooter(inviterEmail)}
    `, "Collaboration Invitation");

    const emailData = {
      sender: {
        name: `${inviterName} (via Collaboration Platform)`,
        email: senderEmail,
      },
      to: [{ email: userEmail, name: "User" }],
      subject: `Invitation to collaborate on "${documentName}" from ${inviterName}`,
      htmlContent,
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

    const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData);
    console.log(`Collaboration invitation sent successfully to ${userEmail}`);
    return response;
  } catch (error) {
    console.error("Error sending collaboration invitation:", error);
    throw new Error(`Failed to send collaboration invitation: ${error.message}`);
  }
};

export default {
  registerAndJoinCollab,
  joinCollab,
};