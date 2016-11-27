'use strict'

const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 3010
app.set('port', port)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS')
  req.method === 'OPTIONS' ? res.send(200) : next()
})

// load router
app.use('/', require('./routes/index'))
app.use('/captcha', require('./routes/captcha'))

app.use((req, res) => {
  res.sendStatus(404)
})

http.createServer(app)
  .listen(port)
  .on('error', (err) => {
    console.log(err.message)
  })

module.exports = app
