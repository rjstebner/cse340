const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log('query success', { text });
      return res;
    } catch (err) {
      console.log('query error', { text });
      throw err;
    }
  },
};