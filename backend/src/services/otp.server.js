import { apiInstance,senderEmail, senderName } from './brevoClient'

export const otpService = async (otp, link = null, email, options = {}) => {
    try {
        const {
            senderEmail = senderEmail || 'noreply@yourdomain.com',
            senderName = senderName || 'Your App Name',
            subject = 'Your OTP Verification Code',
            expiryMinutes = 15,
            templateId = null
        } = options

        const emailData = {
            sender: {
                email: senderEmail,
                name: senderName
            },
            to: [{ email: email }],
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
            // HTML email content
            emailData.htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center;">
                        <h2 style="color: #4a5568; margin-bottom: 20px;">Verify Your Email</h2>
                        <p style="font-size: 16px; color: #4a5568;">Please use the following OTP code to verify your email address:</p>
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h1 style="font-size: 40px; letter-spacing: 8px; color: #2d3748; margin: 0;">${otp}</h1>
                        </div>
                        <p style="font-size: 14px; color: #718096;">This OTP is valid for ${expiryMinutes} minutes.</p>
                        ${link ? `<p style="margin-top: 20px;"><a href="${link}" style="background-color: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>` : ''}
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        <p style="font-size: 12px; color: #a0aec0;">If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
                </html>
            `
            emailData.textContent = `Your OTP verification code is: ${otp}\n\nThis OTP is valid for ${expiryMinutes} minutes.\n${link ? `Click here to verify: ${link}` : ''}`
        }

        const response = await apiInstance.post('/smtp/email', emailData)

        return {
            success: true,
            data: response.data,
            message: 'OTP sent successfully'
        }
    } catch (error) {
        console.error('Error sending OTP email:', error.response?.data || error.message)
        
        return {
            success: false,
            error: error.response?.data || error.message,
            message: 'Failed to send OTP'
        }
    }
}