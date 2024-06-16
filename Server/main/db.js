const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'postgres', /* good */
    database: 'main_db',
    password: 'pass',
    post: 5432 /* good */
})

module.exports = pool