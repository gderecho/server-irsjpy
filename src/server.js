const express = require('express')
const body = require('body-parser')
const cors = require('cors')
const config = require('./config');
const log = require('./log')(config);
const app = express()

app.use(body.urlencoded({
    extended: true
}))
app.use(body.json())
app.use(cors())

log.info("Loaded configuration", {configuration: config})

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
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
    res.send({
        stat: "Received message",
        msg: req.body,
        method: `${req.method} ${req.originalUrl}`
    })
})

app.listen(config.port, () => log.info(`irsjpy node server listening on port ${config.port}`))
