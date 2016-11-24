'use strict'

const router = require('express')()

router.get('/', (req, res) => {
  let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
  res.json({code: [...myMap][1]})
})

module.exports = router
