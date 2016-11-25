'use strict'

const router = require('express').Router()
const CCaptcha = require('../libs/ccaptcha')
const logger = require('../libs/logger')
const koaRedis = require('koa-redis')
const uuid = require('node-uuid')
const config = require('config')
const redis = require('redis')
const co = require('co')
const rConfig = config.get('redis')

const getDb = () => {
  let client = redis.createClient(rConfig.url)
  return koaRedis({ client: client, db: 'captcha' })
}

const getImageData = () => {
  let cCaptcha = new CCaptcha()
  return cCaptcha.image(config.get('captcha'))
}

router.get('/', (req, res) => {
  co(function *() {
    try {
      let db = getDb()
      let imgData = getImageData()
      let key = uuid.v1().toUpperCase()
      yield db.client.set(key, imgData.text)
      db.client.expire(key, rConfig.keyExpireTime || 120)
      return res.status(200)
        .json({ key: key, image: imgData.data })
    } catch (err) {
      logger.error(err.message)
      return res.sendStatus(500)
    }
  })
})

router.post('/verify', (req, res) => {

})

module.exports = router
