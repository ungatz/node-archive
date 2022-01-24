'use strict'

const pg = require('pg')
const conString = 'postgres://admin:password@localhost/node_trail' // make sure to match your own database's credentials
let pool = new pg.Pool({connectionString: conString});
pool.connect(function (err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }
  client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
    done()

    if (err) {
      return console.error('error happened during query', err)
    }
    console.log(result.rows[0])
    process.exit(0)
  })
});
pool.end();
