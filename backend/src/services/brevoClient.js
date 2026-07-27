import { BrevoClient } from '@getbrevo/brevo'
import { ENV } from '../config/ENV.js';

export const apiInstance = new BrevoClient({
  apiKey : ENV.BREVO_API_KEY
})

export const senderEmail = ENV.BREVO_SENDER_EMAIL
export const senderName = ENV.BREVO_SENDER_NAME