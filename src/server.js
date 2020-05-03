const express = require('express')
const body = require('body-parser')
const cors = require('cors')
const config = require('./config')
const log = require('./log')(config)
const data = require('./data')(config.databaseurl, log)
const mailer = require('./mailer')

const app = express()

app.use(body.urlencoded({
    extended: true
}))
app.use(body.json())
app.use(cors())

log.info("Loaded configuration", {configuration: config})

app.get('/', (req, res) => {
    data.messages(
        (err, result) => {
            if(err) {
                log.error(err)
            } else {
                log.info("Queried database successfully")
            }
            res.send(result.rows)
        }
    )
})
app.post('/', async (req, res, next) => {
    log.info(
        "Received request",
        {
            req: {
                body: req.body,
                url: req.originalUrl,
                method: req.method
            }
        }
    )
    await mailer.send(req.body)
    res.send({
        stat: "Received message",
        msg: req.body,
        method: `${req.method} ${req.originalUrl}`
    })
})

app.listen(config.port, () => log.info(`irsjpy node server listening on port ${config.port}`))

