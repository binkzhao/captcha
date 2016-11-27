'use strict'

const router = require('express').Router()
const logger = require('../libs/logger')
const uuid = require('node-uuid')
const utils = require('../libs/utils')
const config = require('config')
const co = require('co')

router.get('/', (req, res) => {
  co(function *() {
    try {
      let db = utils.getDb()
      let {text, image} = utils.captchaInfo()
      let key = uuid.v1().toUpperCase()

      yield db.client.set(key, text)
      db.client.expire(
        key, (config.get('redis')).keyExpireTime || 120
      )

      return res.status(200)
        .json({ key: key, image: image })
    } catch (err) {
      logger.error(err.message)
      return res.sendStatus(500)
    }
  })
})

router.post('/verify', (req, res) => {
  co(function *() {
    try {
      let key = req.body.key || null
      let value = req.body.value || null
      if (utils.isNull(key) || utils.isNull(value)) {
        return res.status(422)
          .json({msg: 'params error'})
      }

      let db = utils.getDb()
      let reply = yield db.client.get(key)
      if (utils.isNull(reply)) {
        return res.status(403)
          .json({msg: 'invalid key'})
      }

      if (reply.toLowerCase() === value.toLowerCase()) {
        db.client.expire(key, -2)
        return res.status(200)
          .json({msg: 'ok'})
      }

      return res.status(403)
        .json({msg: 'invalid value'})
    } catch (err) {
      logger.error(err.message)
      return res.sendStatus(500)
    }
  })
})

module.exports = router
