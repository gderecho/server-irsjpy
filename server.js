const express = require('express')
const body = require('body-parser')
const cors = require('cors')
const app = express()

app.use(body.urlencoded({
    extended: true
}))
app.use(body.json())
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
    console.info(`${req.method} ${req.originalUrl}`)
    res.send({
        stat: "Received message",
        msg: req.body,
        method: `${req.method} ${req.originalUrl}`
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
