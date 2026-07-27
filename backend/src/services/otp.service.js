import { apiInstance, senderEmail, senderName } from './brevoClient.js'

// Color scheme constants for consistent branding
const COLORS = {
    primary: '#4F46E5',      // Indigo - main brand color
    primaryLight: '#818CF8',  // Lighter indigo
    primaryDark: '#3730A3',   // Darker indigo
    secondary: '#10B981',     // Emerald green - success/verify
    background: '#F9FAFB',    // Light gray background
    cardBg: '#FFFFFF',       // White card background
    text: '#1F2937',         // Dark gray text
    textLight: '#6B7280',    // Medium gray text
    textMuted: '#9CA3AF',    // Light gray text
    border: '#E5E7EB',       // Border color
    danger: '#EF4444',       // Red for warnings
    warning: '#F59E0B',      // Amber for warnings
}

export const otpService = async (otp, email, options = {}) => {
    try {
        const {
            senderEmail: customSenderEmail,
            senderName: customSenderName,
            subject = 'Your OTP Verification Code',
            expiryMinutes = 15,
            templateId = null,
            link = null,
            includeBranding = true
        } = options

        // Use provided sender info or fallback to imported values
        const finalSenderEmail = customSenderEmail || senderEmail || 'noreply@yourdomain.com'
        const finalSenderName = customSenderName || senderName || 'Your App Name'

        const emailData = {
            sender: {
                email: finalSenderEmail,
                name: finalSenderName
            },
            to: [{ email }],
            subject: subject
        }

        // If using a template
        if (templateId) {
            emailData.templateId = templateId
            emailData.params = {
                OTP: otp,
                LINK: link || '',
                EXPIRY: expiryMinutes
            }
        } else {
            // HTML email content with enhanced styling
            emailData.htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    </style>
                </head>
                <body style="
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    line-height: 1.6;
                    color: ${COLORS.text};
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: ${COLORS.background};
                ">
                    <div style="
                        background-color: ${COLORS.cardBg};
                        border-radius: 16px;
                        padding: 40px 35px;
                        text-align: center;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        border: 1px solid ${COLORS.border};
                    ">
                        <!-- Logo/Header Section -->
                        ${includeBranding ? `
                        <div style="margin-bottom: 25px;">
                            <div style="
                                display: inline-block;
                                background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});
                                color: white;
                                width: 60px;
                                height: 60px;
                                border-radius: 12px;
                                line-height: 60px;
                                font-size: 28px;
                                font-weight: 700;
                                margin-bottom: 10px;
                            ">
                                🔐
                            </div>
                            <h1 style="
                                color: ${COLORS.text};
                                font-size: 24px;
                                font-weight: 700;
                                margin: 0;
                                letter-spacing: -0.5px;
                            ">
                                Email Verification
                            </h1>
                        </div>
                        ` : ''}

                        <!-- Main Content -->
                        <h2 style="
                            color: ${COLORS.text};
                            font-size: 20px;
                            font-weight: 600;
                            margin-bottom: 15px;
                        ">
                            Verify Your Email Address
                        </h2>
                        
                        <p style="
                            font-size: 16px;
                            color: ${COLORS.textLight};
                            margin-bottom: 30px;
                        ">
                            Please use the following One-Time Password (OTP) to complete your verification:
                        </p>

                        <!-- OTP Code Box -->
                        <div style="
                            background: linear-gradient(135deg, ${COLORS.background}, #F3F4F6);
                            border-radius: 12px;
                            padding: 25px 20px;
                            margin: 20px 0 25px 0;
                            border: 2px dashed ${COLORS.primaryLight};
                        ">
                            <div style="
                                font-size: 48px;
                                font-weight: 700;
                                letter-spacing: 12px;
                                color: ${COLORS.primary};
                                font-family: 'Courier New', monospace;
                                background: white;
                                padding: 15px 20px;
                                border-radius: 8px;
                                display: inline-block;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                            ">
                                ${otp}
                            </div>
                        </div>

                        <!-- Expiry Info -->
                        <div style="
                            background-color: #FEF3C7;
                            border-left: 4px solid ${COLORS.warning};
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin: 20px 0;
                            text-align: left;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 14px;
                                color: #92400E;
                            ">
                                ⏱️ This OTP is valid for <strong>${expiryMinutes} minutes</strong>
                            </p>
                        </div>

                        <!-- Verify Button (if link provided) -->
                        ${link ? `
                        <div style="margin: 25px 0 20px 0;">
                            <a href="${link}" style="
                                background: linear-gradient(135deg, ${COLORS.secondary}, #059669);
                                color: white;
                                padding: 14px 40px;
                                text-decoration: none;
                                border-radius: 8px;
                                display: inline-block;
                                font-weight: 600;
                                font-size: 16px;
                                transition: transform 0.2s, box-shadow 0.2s;
                                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
                            ">
                                ✅ Verify Email Now
                            </a>
                        </div>
                        ` : ''}

                        <!-- Security Note -->
                        <div style="
                            background-color: #EFF6FF;
                            border-left: 4px solid ${COLORS.primary};
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin: 20px 0 25px 0;
                            text-align: left;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 13px;
                                color: #1E3A8A;
                            ">
                                🔒 For security reasons, never share this OTP with anyone.
                                Our team will never ask for this code.
                            </p>
                        </div>

                        <hr style="
                            border: none;
                            border-top: 1px solid ${COLORS.border};
                            margin: 30px 0 20px 0;
                        ">

                        <!-- Footer -->
                        <div style="
                            font-size: 13px;
                            color: ${COLORS.textMuted};
                            text-align: center;
                        ">
                            <p style="margin: 5px 0;">
                                If you didn't request this verification, please ignore this email
                            </p>
                            <p style="margin: 5px 0;">
                                or contact our support team immediately.
                            </p>
                            ${includeBranding ? `
                            <p style="margin-top: 15px; font-size: 12px; color: ${COLORS.textMuted};">
                                © ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.
                            </p>
                            ` : ''}
                        </div>
                    </div>
                </body>
                </html>
            `

            // Plain text version for email clients that don't support HTML
            emailData.textContent = `
                Email Verification

                Your OTP verification code is: ${otp}

                This OTP is valid for ${expiryMinutes} minutes.
                ${link ? `Click here to verify: ${link}` : ''}

                For security reasons, never share this OTP with anyone.
                Our team will never ask for this code.

                If you didn't request this, please ignore this email.
                ${includeBranding ? `\n© ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.` : ''}
            `
        }

        const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData)

        return {
            success: true,
            data: response.data,
            message: 'OTP sent successfully'
        }
    } catch (error) {
        console.error('OTP Service Error:', error.response?.data || error.message)
        
        return {
            success: false,
            error: error.response?.data || error.message,
            message: 'Failed to send OTP'
        }
    }
}

export const emailVerifyLinkService = async (link, email, options = {}) => {
    try {
        const {
            senderEmail: customSenderEmail,
            senderName: customSenderName,
            subject = 'Verify Your Email Address',
            includeBranding = true,
            redirectUrl = null,
            expiryHours = 24
        } = options

        // Use provided sender info or fallback to imported values
        const finalSenderEmail = customSenderEmail || senderEmail || 'noreply@yourdomain.com'
        const finalSenderName = customSenderName || senderName || 'Your App Name'

        const emailData = {
            sender: {
                email: finalSenderEmail,
                name: finalSenderName
            },
            to: [{ email }],
            subject: subject,
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    </style>
                </head>
                <body style="
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    line-height: 1.6;
                    color: ${COLORS.text};
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: ${COLORS.background};
                ">
                    <div style="
                        background-color: ${COLORS.cardBg};
                        border-radius: 16px;
                        padding: 40px 35px;
                        text-align: center;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        border: 1px solid ${COLORS.border};
                    ">
                        <!-- Logo/Header Section -->
                        ${includeBranding ? `
                        <div style="margin-bottom: 25px;">
                            <div style="
                                display: inline-block;
                                background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});
                                color: white;
                                width: 60px;
                                height: 60px;
                                border-radius: 12px;
                                line-height: 60px;
                                font-size: 28px;
                                font-weight: 700;
                                margin-bottom: 10px;
                            ">
                                📧
                            </div>
                            <h1 style="
                                color: ${COLORS.text};
                                font-size: 24px;
                                font-weight: 700;
                                margin: 0;
                                letter-spacing: -0.5px;
                            ">
                                Verify Your Email
                            </h1>
                        </div>
                        ` : ''}

                        <!-- Main Content -->
                        <h2 style="
                            color: ${COLORS.text};
                            font-size: 20px;
                            font-weight: 600;
                            margin-bottom: 15px;
                        ">
                            One More Step!
                        </h2>
                        
                        <p style="
                            font-size: 16px;
                            color: ${COLORS.textLight};
                            margin-bottom: 25px;
                        ">
                            Please verify your email address to complete your registration
                            and start using our services.
                        </p>

                        <!-- Verify Button -->
                        <div style="margin: 30px 0;">
                            <a href="${link}" style="
                                background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark});
                                color: white;
                                padding: 16px 48px;
                                text-decoration: none;
                                border-radius: 10px;
                                display: inline-block;
                                font-weight: 600;
                                font-size: 18px;
                                transition: transform 0.2s, box-shadow 0.2s;
                                box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
                            ">
                                ✅ Verify My Email
                            </a>
                        </div>

                        <!-- Or copy link section -->
                        <div style="
                            background-color: ${COLORS.background};
                            border-radius: 8px;
                            padding: 15px;
                            margin: 20px 0;
                            text-align: left;
                        ">
                            <p style="
                                margin: 0 0 8px 0;
                                font-size: 13px;
                                color: ${COLORS.textLight};
                            ">
                                Or copy and paste this link in your browser:
                            </p>
                            <code style="
                                display: block;
                                font-size: 12px;
                                color: ${COLORS.primary};
                                word-break: break-all;
                                background: white;
                                padding: 8px;
                                border-radius: 4px;
                                border: 1px solid ${COLORS.border};
                            ">
                                ${link}
                            </code>
                        </div>

                        <!-- Expiry Info -->
                        <div style="
                            background-color: #FEF3C7;
                            border-left: 4px solid ${COLORS.warning};
                            padding: 12px 16px;
                            border-radius: 6px;
                            margin: 20px 0;
                            text-align: left;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 14px;
                                color: #92400E;
                            ">
                                ⏱️ This verification link will expire in <strong>${expiryHours} hours</strong>
                            </p>
                        </div>

                        <!-- Why verify section -->
                        <div style="
                            background-color: #EFF6FF;
                            border-radius: 8px;
                            padding: 16px;
                            margin: 20px 0 25px 0;
                            text-align: left;
                        ">
                            <p style="
                                margin: 0 0 8px 0;
                                font-size: 14px;
                                font-weight: 600;
                                color: ${COLORS.primary};
                            ">
                                Why verify your email?
                            </p>
                            <ul style="
                                margin: 5px 0;
                                padding-left: 20px;
                                font-size: 13px;
                                color: ${COLORS.textLight};
                            ">
                                <li>Secure your account against unauthorized access</li>
                                <li>Receive important notifications and updates</li>
                                <li>Reset your password if you forget it</li>
                                <li>Access all features of our platform</li>
                            </ul>
                        </div>

                        <hr style="
                            border: none;
                            border-top: 1px solid ${COLORS.border};
                            margin: 30px 0 20px 0;
                        ">

                        <!-- Footer -->
                        <div style="
                            font-size: 13px;
                            color: ${COLORS.textMuted};
                            text-align: center;
                        ">
                            <p style="margin: 5px 0;">
                                If you didn't create an account with us, please ignore this email.
                            </p>
                            ${includeBranding ? `
                            <p style="margin-top: 15px; font-size: 12px; color: ${COLORS.textMuted};">
                                © ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.
                            </p>
                            ` : ''}
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
                Email Verification

                Please verify your email address to complete your registration.

                Click the link below to verify your email:
                ${link}

                This verification link will expire in ${expiryHours} hours.

                Why verify your email?
                - Secure your account against unauthorized access
                - Receive important notifications and updates
                - Reset your password if you forget it
                - Access all features of our platform

                If you didn't create an account with us, please ignore this email.
                ${includeBranding ? `\n© ${new Date().getFullYear()} ${finalSenderName}. All rights reserved.` : ''}
            `
        }

        const response = await apiInstance.transactionalEmails.sendTransacEmail(emailData)

        return {
            success: true,
            data: response.data,
            message: 'Verification email sent successfully'
        }
    } catch (error) {
        console.error('Email Verification Link Service Error:', error.response?.data || error.message)
        
        return {
            success: false,
            error: error.response?.data || error.message,
            message: 'Failed to send verification email'
        }
    }
}