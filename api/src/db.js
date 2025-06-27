// Usamos "Pool" pois ele gerencia múltiplas conexões, o que é mais eficiente.
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST, // Importante: 'db', não 'localhost'!
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};