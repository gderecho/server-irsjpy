const { Pool } = require('pg')

class Data {
    constructor(cstring, log) {
        this.log = log
        this.log.info("Acquiring connection pool")
        this.pool = new Pool({
            connectionString: cstring
        })
    }

    messages(callback) {
        this.log.info("Querying database for messages")
        this.pool.query(
                `select org.name, 
                        org.address, 
                        org.coords,
                        message.content, 
                        message.date, 
                        individual.name poster 
                from message 
                left outer join org 
                    on message.org_id = org.id 
                left outer join individual 
                    on message.user_id = individual.id;
                `, (err, res) => {
            for(let row of res.rows) {
                row.coords = {
                    latitude: row.coords.x,
                    longitude: row.coords.y
                }
            }
            callback(err, res)
        })
    }
}

module.exports = function(cstring, log) {return new Data(cstring, log)}
