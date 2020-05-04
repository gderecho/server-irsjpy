const express = require('express')
const body = require('body-parser')
const cors = require('cors')
const config = require('./config')
const log = require('./log')(config)
const data = require('./data')(config.databaseurl, log)
const mailer = require('./mailer')
const validate = require('./validate')

const app = express()

app.use(body.urlencoded({
    extended: true
}))
app.use(body.json())
app.use(cors())


// credit to https://qiita.com/yukin01/items/1a36606439123525dc6d
const wrap = f => (res, req, next) => {
    f(res, req, next).catch(next);
}

log.info("Loaded configuration", {configuration: config})



app.get('/', wrap(async (req, res) => {
    result = await data.messages();
    res.send(result)
}))


app.post('/', wrap(async (req, res) => {
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
    const body = await validate(req.body)
    log.debug(
        'Transformed request',
        {req: body}
    )
    await mailer.send(body)
    res.send({
        stat: "Acknowledge message",
        msg: body,
        method: `${req.method} ${req.originalUrl}`
    })
}))

app.use((err, req, res, next) => {
    log.error("An error occured", {"details": err, "stack": err.stack})
    next(err)
})


app.listen(config.port, () => log.info(`irsjpy voices server listening on port ${config.port}`))

