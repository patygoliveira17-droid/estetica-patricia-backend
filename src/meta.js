const axios = require('axios');
const { meta, backendUrl } = require('./config');

function buildConnectUrl(state) {
  const params = new URLSearchParams({
    client_id: meta.appId,
    redirect_uri: `${backendUrl}/auth/meta/callback`,
    scope: 'instagram_basic,instagram_content_publish,pages_read_engagement,ads_read,business_management',
    state,
    response_type: 'code'
  });
  return `https://www.facebook.com/${meta.apiVersion}/dialog/oauth?${params.toString()}`;
}

async function exchangeCode(code) {
  const params = new URLSearchParams({
    client_id: meta.appId,
    client_secret: meta.appSecret,
    redirect_uri: `${backendUrl}/auth/meta/callback`,
    code
  });
  const { data } = await axios.get(`https://graph.facebook.com/${meta.apiVersion}/oauth/access_token?${params.toString()}`);
  return data.access_token;
}

async function getLongLivedToken(shortToken) {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: meta.appId,
    client_secret: meta.appSecret,
    fb_exchange_token: shortToken
  });
  const { data } = await axios.get(`https://graph.facebook.com/${meta.apiVersion}/oauth/access_token?${params.toString()}`);
  return data.access_token;
}

async function getInstagramAccount(token) {
  const { data } = await axios.get(`https://graph.facebook.com/${meta.apiVersion}/me/accounts`, {
    params: { access_token: token }
  });
  return data;
}

module.exports = { buildConnectUrl, exchangeCode, getLongLivedToken, getInstagramAccount };