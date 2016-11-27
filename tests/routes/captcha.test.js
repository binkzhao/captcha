'use strict'

const should = require('should')
const app = require('../../app')
const request = require('supertest')
const uuid = require('node-uuid')
const utils = require('../../libs/utils')

describe('captcha apis', () => {
  describe('get captcha api', () => {
    it('display captcha data success', (done) => {
      request(app)
        .get('/captcha')
        .expect(200)
        .end((err, res) => {
          if (err) { throw err }
          should.exist(res.body.key)
          should.exist(res.body.image)
          done()
        })
    })
  })

  describe('verify captcha api', () => {
    let key = uuid.v1().toUpperCase()
    let value = uuid.v1()
    before((done) => {
      let db = utils.getDb()
      db.client.set(key, value).then(() => {
        done()
      })
    })

    it('params error', (done) => {
      request(app)
        .post('/captcha/verify')
        .send({ key: null })
        .expect(422)
        .end((err, res) => {
          if (err) { throw err }
          should(res.res.body.msg).be.exactly('params error')
          done()
        })
    })

    it('invalid key', (done) => {
      request(app)
        .post('/captcha/verify')
        .send({ key: uuid.v1(), value: 'AJH7' })
        .expect(403)
        .end((err, res) => {
          if (err) { throw err }
          should(res.res.body.msg).be.exactly('invalid key')
          done()
        })
    })

    it('invalid value', (done) => {
      request(app)
        .post('/captcha/verify')
        .send({ key: key, value: 'value' })
        .expect(403)
        .end((err, res) => {
          if (err) { throw err }
          should(res.res.body.msg).be.exactly('invalid value')
          done()
        })
    })

    it('verify success', (done) => {
      request(app)
        .post('/captcha/verify')
        .send({ key: key, value: value })
        .expect(200)
        .end((err, res) => {
          if (err) { throw err }
          should(res.res.body.msg).be.exactly('ok')
          done()
        })
    })

    it('has verify value', (done) => {
      request(app)
        .post('/captcha/verify')
        .send({ key: key, value: value })
        .expect(403)
        .end((err, res) => {
          if (err) { throw err }
          should(res.res.body.msg).be.exactly('invalid key')
          done()
        })
    })
  })
})

