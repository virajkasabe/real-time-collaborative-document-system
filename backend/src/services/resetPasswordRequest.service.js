import { BrevoClient } from '@getbrevo/brevo'
import { ENV } from '../config/ENV.js';

const apiInstance = new BrevoClient({
  apiKey : ENV.BREVO_API_KEY
})

export const resetPasswordRequest = async(
    link,
    email,
    fullName
) => {
    
}