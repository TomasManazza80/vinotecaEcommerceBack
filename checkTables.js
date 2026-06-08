const sequelize = require('./dbconnection/db');
sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
  .then(r => console.log(r[0]))
  .catch(e => console.error(e))
  .finally(() => process.exit(0));
