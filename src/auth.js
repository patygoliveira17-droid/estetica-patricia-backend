const jwt = require('jsonwebtoken');
const { jwtSecret, adminEmail, adminPassword } = require('./config');

function login(email, password) {
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: 'admin' }, jwtSecret, { expiresIn: '7d' });
    return { token, email };
  }
  return null;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = { login, authMiddleware };