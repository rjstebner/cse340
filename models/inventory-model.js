const pool = require('../database/index.js');

async function getClassifications() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classificaiton_name');
}

module.exports = {getClassifications}

