'use strict'

const router = require('express')()

router.get('/', (req, res) => {
  res.json({ code: 123 })
})

module.exports = router
