// Armazenamento em memória do estado das conexões
const connections = {};   // platform -> { connected, connectedAt, account, tokens }
const pendingStates = {}; // state -> { platform, createdAt }

function defaultStatus() {
  return { connected: false, connectedAt: null, account: null };
}

function getStatus(platform) {
  if (!connections[platform]) connections[platform] = defaultStatus();
  const { tokens, ...publicStatus } = connections[platform];
  return publicStatus;
}

function setPending(state, platform) {
  pendingStates[state] = { platform, createdAt: Date.now() };
}

function consumePending(state) {
  const pending = pendingStates[state];
  if (!pending) return null;
  delete pendingStates[state];
  return pending;
}

function saveTokens(platform, tokens, accountInfo) {
  connections[platform] = {
    ...defaultStatus(),
    connected: true,
    connectedAt: new Date().toISOString(),
    account: accountInfo || null,
    tokens
  };
  return getStatus(platform);
}

function disconnect(platform) {
  connections[platform] = defaultStatus();
  return getStatus(platform);
}

module.exports = { getStatus, setPending, consumePending, saveTokens, disconnect };
