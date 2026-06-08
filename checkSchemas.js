require('dotenv').config();
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
c.connect()
  .then(() => c.query('SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN (\'pg_catalog\', \'information_schema\')'))
  .then(r => console.log(r.rows))
  .catch(console.error)
  .finally(() => process.exit(0));
