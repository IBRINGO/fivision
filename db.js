// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Valeurs par défaut pour faciliter le dev local ou Docker
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', // 'db' si Docker, 'localhost' si local
  database: process.env.DB_NAME || 'my_base',
  password: process.env.DB_PASSWORD || 'Goita36@',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  max: 20,               // nombre max de connexions dans le pool
  idleTimeoutMillis: 30000, // 30 secondes avant de libérer une connexion inactive
  connectionTimeoutMillis: 2000, // 2 secondes pour établir une connexion
});

// Événements de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL', err);
});

// Fonction utilitaire pour tester la connexion
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('🟢 PostgreSQL actif, heure actuelle :', res.rows[0].now);
  } catch (err) {
    console.error('❌ Impossible de se connecter à PostgreSQL', err);
  }
};

testConnection();

module.exports = pool;
