module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'troque-este-segredo',
  adminEmail: process.env.ADMIN_EMAIL || 'paty.g.oliveira17@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  meta: {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    apiVersion: 'v19.0'
  },
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || ''
  },
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000'
};