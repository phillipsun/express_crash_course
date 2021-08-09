const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const path = require('path')
const memberList = require('../Members')
const app = require('../index')
chai.use(chaiHttp)

describe('Unit Tests', function () {
  it('member list is an array', () => {
    expect(memberList).to.be.an('array')
  })

  it('default route should return 200', function (done) {
    chai
      .request(app)
      .get('/')
      .end(function (err, res) {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('GET members should return an array', (done) => {
    chai
      .request(app)
      .get('/api/members')
      .end(function (err, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
  })

  it('GET single member should return an array', (done) => {
    chai
      .request(app)
      .get('/api/members/1')
      .end(function (err, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
  })

  it('GET single member should return an error with invalid id', (done) => {
    chai
      .request(app)
      .get('/api/members/abc')
      .end(function (err, res) {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('POST new member should return an array', (done) => {
    chai
      .request(app)
      .post('/api/members')
      .set('content-type', 'application/json')
      .send({name: 'Phil', email: 'psun@gmail.com'})
      .end(function(err, res) {
        expect(res.body).to.be.an('array')
        done()
      })
  })

  it('POST new member should return 400 if name or email is missing', (done) => {
    chai
      .request(app)
      .post('/api/members')
      .set('content-type', 'application/json')
      .send({ name: 'Phil' })
      .end(function(err, res) {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('DELETE member should return an object', (done) => {
    chai
      .request(app)
      .delete('/api/members/2')
      .end(function(err, res) {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('DELETE invalid member should return 400', (done) => {
    let testId = 'abc'
    chai
      .request(app)
      .delete(`/api/members/${testId}`)
      .end(function(err, res) {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('PUT member should return an object with valid id/name/email', (done) => {
    chai
      .request(app)
      .put('/api/members/2')
      .set('content-type', 'application/json')
      .send({ name: 'RandomName', email: 'hello@gmail.com' })
      .end(function(err, res) {
        expect(res.body).to.be.an('object')
        expect(res).to.have.status(200)
        done()
      })
  })

  it('PUT member should return an object when passing valid ID and empty string for name/email', (done) => {
    chai
      .request(app)
      .put('/api/members/2')
      .set('content-type', 'application/json')
      .send({ name: '', email: '' })
      .end(function(err, res) {
        expect(res.body).to.be.an('object')
        expect(res).to.have.status(200)
        done()
      })
  })

  it('PUT invalid member should return 400', (done) => {
    let testId = 'abc'
    chai
      .request(app)
      .put(`/api/members/${testId}`)
      .end(function(err, res) {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('POST to upload route should return a 200', (done) => {
    chai
      .request(app)
      .post('/upload')
      .attach('file', fs.readFileSync(path.resolve(__dirname, '../demoFile.html')), 'demoFile.html')
      .end(function(err, res) {
        expect(res).to.have.status(200)       
        done()
      })
  })

  it('POST to upload route should return a 500', (done) => {
    chai
      .request(app)
      .post('/upload')
      .end(function(err, res) {
        expect(res).to.have.status(500)       
        done()
      })
  })
})
