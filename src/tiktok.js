const axios = require('axios');
const { tiktok, backendUrl } = require('./config');

function buildConnectUrl(state) {
  const params = new URLSearchParams({
    client_key: tiktok.clientKey,
    response_type: 'code',
    scope: 'user.info.basic,video.list,video.data,analytics.basic,video.publish',
    redirect_uri: `${backendUrl}/auth/tiktok/callback`,
    state
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    client_key: tiktok.clientKey,
    client_secret: tiktok.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${backendUrl}/auth/tiktok/callback`
  });
  const { data } = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return data;
}

module.exports = { buildConnectUrl, exchangeCode };