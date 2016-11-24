'use strict'

const express = require('express')
const http = require('http')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()

// set app port
const port = process.env.PORT || 3010
app.set('port', port)

// load views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// load static files
app.use(express.static(path.join(__dirname, 'public')))

// handle Transmit json data
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS')
  req.method === 'OPTIONS' ? res.send(200) : next()
})

// load router
app.use('/', require('./routes/index'))
app.use('/captcha', require('./routes/captcha'))

app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

http.createServer(app)
  .listen(port)
  .on('error', (err) => {
    console.log(err.message)
  })

module.exports = app
