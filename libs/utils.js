'use strict'

const koaRedis = require('koa-redis')
const redis = require('redis')
const CCaptcha = require('./ccaptcha')
const config = require('config')

exports.getDb = () => {
  let client = redis.createClient(
    process.env['REDIS_URL'] || (config.get('redis')).url
  )
  return koaRedis({ client: client, db: 'captcha' })
}

exports.captchaInfo = () => {
  return (new CCaptcha())
    .image(config.get('captcha'))
}

exports.isNull = (param) => {
  return param === '' || param === undefined || param === null
}
