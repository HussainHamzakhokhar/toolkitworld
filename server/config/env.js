/** Reads configuration from environment variables. Never hard-code secrets. */
export const config = {
  port: Number(process.env.PORT || 8787),
  // Comma-separated list of sites allowed to call the API, e.g. https://toolkitworld.com,https://www.toolkitworld.com
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173').split(',').map((s) => s.trim()).filter(Boolean),
  // Where contact messages are forwarded (e.g. a Discord/Slack incoming webhook URL). Empty = log a short notice only.
  contactWebhookUrl: process.env.CONTACT_WEBHOOK_URL || '',
  isProduction: process.env.NODE_ENV === 'production',
};
