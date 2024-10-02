const { Pool } = require('pg')
require('dotenv').config()

let pool
if (process.env.NODE_ENV === 'development') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log('executed query', { text })
      return res
    } catch (error) {
      console.error('error in query', { text, error })
      throw error
    }
  },
}