const { Pool } = require('pg')

const pool = new Pool({
    user: 'root',
    host: 'postgres', /* good */
    database: 'postgres',
    password: 'pass',
    post: 5432 /* good */
})

module.exports = pool