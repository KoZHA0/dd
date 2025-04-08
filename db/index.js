const { Pool } = require('pg');
const { host, user, port, password, database } = require('../secrets/db_configuration');

const pool = new Pool({ host, user, port, password, database });


module.exports = pool;