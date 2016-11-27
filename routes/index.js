'use strict'

const router = require('express')()

router.get('/', (req, res) => {
  res.send('Welcome To Bink Micro Service')
})

module.exports = router
