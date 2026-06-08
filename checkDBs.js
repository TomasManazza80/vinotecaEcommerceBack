require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
c.connect()
  .then(() => c.query('SELECT datname FROM pg_database WHERE datistemplate = false;'))
  .then(r => console.log(r.rows))
  .catch(console.error)
  .finally(() => process.exit(0));
