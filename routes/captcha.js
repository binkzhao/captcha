'use strict'

const router = require('express').Router()
const captcha = require('../libs/ccaptcha')
const config = require('config')

router.get('/', (req, res) => {
  captcha.data(config.get('captcha'), (text, data) => {
    let img = '<img src="' + data + '">'
    return res.send(img)
  })
})

router.post('/verify', (req, res) => {

})

module.exports = router
