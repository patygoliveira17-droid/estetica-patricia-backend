const express = require('express');
const crypto = require('crypto');
const { login, authMiddleware } = require('./auth');
const store = require('./store');
const meta = require('./meta');
const tiktok = require('./tiktok');

const PLATFORMS = ['meta', 'tiktok', 'whatsapp', 'mercadopago', 'google_business'];

function setupRoutes(app) {
  // Login
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    const result = login(email, password);
    if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
    res.json(result);
  });

  // Status das conexões
  app.get('/api/connections', authMiddleware, (req, res) => {
    const statuses = {};
    for (const platform of PLATFORMS) {
      statuses[platform] = store.getStatus(platform);
    }
    res.json(statuses);
  });

  // Iniciar conexão (OAuth)
  app.get('/api/connections/:platform/connect', authMiddleware, (req, res) => {
    const { platform } = req.params;
    if (!PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }
    const state = crypto.randomBytes(16).toString('hex');
    let url;
    if (platform === 'meta') url = meta.buildConnectUrl(state);
    else if (platform === 'tiktok') url = tiktok.buildConnectUrl(state);
    else url = null; // plataformas sem OAuth ainda
    res.json({ url });
  });

  // Desconectar
  app.post('/api/connections/:platform/disconnect', authMiddleware, (req, res) => {
    const { platform } = req.params;
    if (!PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }
    store.setDisconnected(platform);
    res.json({ ok: true, platform, connected: false });
  });

  // Callback Meta
  app.get('/auth/meta/callback', async (req, res) => {
    const { code, state, error } = req.query;
    if (error) return res.status(400).send(`Erro na autorização Meta: ${error}`);
    try {
      const shortToken = await meta.exchangeCode(code);
      const longToken = await meta.getLongLivedToken(shortToken);
      const accounts = await meta.getInstagramAccount(longToken);
      store.setConnected('meta', { accessToken: longToken, accounts });
      res.send('Meta conectada com sucesso! Você já pode fechar esta aba.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Falha ao conectar Meta. Tente novamente.');
    }
  });

  // Callback TikTok
  app.get('/auth/tiktok/callback', async (req, res) => {
    const { code, state, error } = req.query;
    if (error) return res.status(400).send(`Erro na autorização TikTok: ${error}`);
    try {
      const tokenData = await tiktok.exchangeCode(code);
      store.setConnected('tiktok', { accessToken: tokenData.access_token, ...tokenData });
      res.send('TikTok conectado com sucesso! Você já pode fechar esta aba.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Falha ao conectar TikTok. Tente novamente.');
    }
  });
}

module.exports = { setupRoutes };