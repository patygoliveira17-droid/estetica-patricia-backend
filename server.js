require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Estética Patrícia Broering — Backend', status: 'ok' });
});

setupRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});