'use strict'

const winston = require('winston')
const moment = require('moment')

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  'timestamp': () => {
    return moment().format('LLL')
  },
  'colorize': true
})
winston.add(winston.transports.File, {
  filename: 'logs/express.log',
  'timestamp': () => {
    return moment().format('LLL')
  },
  'colorize': true
})

winston.level = 'error'

exports.error = msg => {
  winston.error(msg)
}

exports.info = msg => {
  winston.info(msg)
}

exports.debug = msg => {
  winston.error(msg)
}
