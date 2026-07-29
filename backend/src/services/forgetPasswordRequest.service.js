import { apiInstance, senderEmail, senderName } from './brevoClient.js'

export const forgetPasswordService = async (forgetPasswordRequestUrl, email) => {
    try {
        const sender = {
            email: senderEmail,
            name: senderName
        }

        const response = await apiInstance.transactionalEmails.sendTransacEmail({
            sender: sender,
            to: [{ email: email }],
            subject: 'Password Reset Request',
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #2d3748;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .container {
                            background: #ffffff;
                            border-radius: 20px;
                            padding: 40px;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 48px;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 60px;
                            height: 60px;
                        }
                        h2 {
                            color: #2d3748;
                            font-size: 28px;
                            margin: 0 0 10px 0;
                            font-weight: 700;
                        }
                        .subtitle {
                            color: #718096;
                            font-size: 16px;
                            margin: 0;
                        }
                        .divider {
                            height: 3px;
                            background: linear-gradient(to right, #667eea, #764ba2);
                            margin: 25px 0;
                            border-radius: 2px;
                        }
                        .content {
                            color: #4a5568;
                            font-size: 16px;
                        }
                        .content p {
                            margin: 15px 0;
                        }
                        .button-container {
                            text-align: center;
                            margin: 35px 0;
                        }
                        .reset-button {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 16px 45px;
                            text-decoration: none;
                            border-radius: 50px;
                            display: inline-block;
                            font-size: 18px;
                            font-weight: 600;
                            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                            transition: all 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .reset-button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                        }
                        .info-box {
                            background: #f7fafc;
                            border-left: 4px solid #667eea;
                            padding: 15px 20px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .info-box strong {
                            color: #2d3748;
                        }
                        .expiry {
                            color: #e53e3e;
                            font-weight: 600;
                        }
                        .link-container {
                            background: #f7fafc;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 15px 0;
                            word-break: break-all;
                            font-size: 13px;
                            color: #4a5568;
                            border: 1px solid #e2e8f0;
                        }
                        .link-container a {
                            color: #667eea;
                            text-decoration: none;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e2e8f0;
                            text-align: center;
                        }
                        .footer-text {
                            color: #a0aec0;
                            font-size: 13px;
                            line-height: 1.8;
                        }
                        .security-badge {
                            display: inline-block;
                            background: #48bb78;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            margin-top: 5px;
                        }
                        .security-badge img {
                            width: 14px;
                            height: 14px;
                            vertical-align: middle;
                            margin-right: 4px;
                        }
                        .highlight {
                            color: #667eea;
                            font-weight: 600;
                        }
                        .icon {
                            width: 20px;
                            height: 20px;
                            vertical-align: middle;
                            margin-right: 6px;
                        }
                        @media only screen and (max-width: 480px) {
                            .container {
                                padding: 25px;
                            }
                            h2 {
                                font-size: 24px;
                            }
                            .reset-button {
                                padding: 14px 35px;
                                font-size: 16px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">
                                <img src="https://img.icons8.com/color/96/000000/lock--v1.png" alt="Security Lock" />
                            </div>
                            <h2>Reset Your Password</h2>
                            <p class="subtitle">Secure your account in just a few clicks</p>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="content">
                            <p>Hello there!</p>
                            <p>We received a request to reset the password for your account associated with <span class="highlight">${email}</span>.</p>
                            
                            <div class="info-box">
                                <strong>
                                    <img src="https://img.icons8.com/color/24/000000/key--v1.png" alt="Key" class="icon" />
                                    Quick Action Required
                                </strong>
                                <p style="margin: 8px 0 0 0;">Click the button below to create a new, secure password for your account.</p>
                            </div>
                        </div>
                        
                        <div class="button-container">
                            <a href="${forgetPasswordRequestUrl}" class="reset-button">
                                <img src="https://img.icons8.com/color/24/000000/refresh--v1.png" alt="Reset" style="width:20px;height:20px;vertical-align:middle;margin-right:8px;" />
                                Reset Password
                            </a>
                        </div>
                        
                        <div class="content">
                            <div class="info-box" style="border-left-color: #e53e3e;">
                                <strong>
                                    <img src="https://res.cloudinary.com/qnf2f4fq/image/upload/v1785166465/favicon_z4byb1.png" alt="Clock" class="icon" />
                                    Important Notes:
                                </strong>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #4a5568;">
                                    <li>This link will expire in <span class="expiry">1 hour</span></li>
                                    <li>This link can only be used <strong>once</strong></li>
                                    <li>For security, the link will become invalid after use</li>
                                </ul>
                            </div>
                            
                            <p style="margin-top: 25px;">
                                <img src="https://img.icons8.com/color/24/000000/info--v1.png" alt="Info" class="icon" />
                                If you didn't request this password reset, please ignore this email or 
                                <a href="#" style="color: #667eea; text-decoration: none; font-weight: 600;">contact support</a> 
                                if you have concerns.
                            </p>
                            
                            <p style="margin-top: 20px; font-size: 14px; color: #718096;">
                                <strong>
                                    <img src="https://img.icons8.com/color/24/000000/shield--v1.png" alt="Shield" class="icon" />
                                    Security Tip:
                                </strong> 
                                Always use a strong, unique password for your account.
                            </p>
                        </div>
                        
                        <div class="link-container">
                            <strong>
                                <img src="https://img.icons8.com/color/24/000000/link--v1.png" alt="Link" class="icon" />
                                Direct Link:
                            </strong><br>
                            <a href="${forgetPasswordRequestUrl}">${forgetPasswordRequestUrl}</a>
                        </div>
                        
                        <div class="footer">
                            <span class="security-badge">
                                <img src="https://img.icons8.com/color/24/000000/security-checked--v1.png" alt="Secure" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;" />
                                Secure Connection
                            </span>
                            <p class="footer-text">
                                This is an automated message from <strong>Your App Name</strong>.<br>
                                If you need assistance, please don't hesitate to reach out to our support team.
                            </p>
                            <p class="footer-text" style="margin-top: 10px; font-size: 11px;">
                                © ${new Date().getFullYear()} Your App Name. All rights reserved.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
                PASSWORD RESET REQUEST
                ==============================
                
                Hello there!
                
                We received a request to reset the password for your account associated with ${email}.
                
                Quick Action Required
                Click the link below to create a new, secure password for your account:
                
                ${forgetPasswordRequestUrl}
                
                Important Notes:
                • This link will expire in 1 hour
                • This link can only be used once
                • For security, the link will become invalid after use
                
                If you didn't request this password reset, please ignore this email or contact 
                support if you have concerns.
                
                Security Tip: Always use a strong, unique password for your account.
                
                This is an automated message from Your App Name.
                © ${new Date().getFullYear()} Your App Name. All rights reserved.
            `
        })

        return {
            success: true,
            data: response.data,
            message: 'Password reset email sent successfully'
        }
    } catch (error) {
        console.error('Error sending password reset email:', error.response?.data || error.message)
        
        return {
            success: false,
            error: error.response?.data || error.message,
            message: 'Failed to send password reset email'
        }
    }
}