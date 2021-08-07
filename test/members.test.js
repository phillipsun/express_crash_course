var assert = require('assert')
var chai = require('chai'),
  chaiHttp = require('chai-http')
var expect = chai.expect
var fs = require('fs')
const path = require('path')
var memberList = require('../Members')
var app = require('../index')
const logger = require('../middleware/logger')

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
        // console.log(res.body);
        // console.log('res:::', res);
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
        // console.log(res.body);
        // console.log('res:::', res);
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
      // .send({
      //   '_method': 'put',
      //   'password': '123',
      //   'confirmPassword': '123'
      // })
      // .attach('file', fs.readFileSync(path.join(__dirname, 'mytextfile.txt')), 'mytextfile.txt')
      // .end(function (err, res) {
      //   // expect(res).to.have.status(200)
      //   console.log(res.body);
      //   console.log('res:::', res);
      //   done()
      // })
      .set('content-type', 'application/json')
      .send({name: 'Phil', email: 'psun@gmail.com'})
      .end(function(err, res) {
        console.log(res.body)
        expect(res.body).to.be.an('array')
        done()
      })
  })

  it('POST new member should return an array', (done) => {
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

  it('DELETE member should return an array', (done) => {
    chai
      .request(app)
      .delete('/api/members/2')
      // .send({
      //   '_method': 'put',
      //   'password': '123',
      //   'confirmPassword': '123'
      // })
      // .attach('file', fs.readFileSync(path.join(__dirname, 'mytextfile.txt')), 'mytextfile.txt')
      // .end(function (err, res) {
      //   // expect(res).to.have.status(200)
      //   console.log(res.body);
      //   console.log('res:::', res);
      //   done()
      // })
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




  it('PUT member should return an array', (done) => {
    chai
      .request(app)
      .put('/api/members/2')
      .set('content-type', 'application/json')
      .send({ name: 'RandomName', email: 'hello@gmail.com' })
      .end(function(err, res) {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('PUT member should return an array', (done) => {
    chai
      .request(app)
      .put('/api/members/2')
      .set('content-type', 'application/json')
      .send({ name: '', email: '' })
      .end(function(err, res) {
        expect(res.body).to.be.an('object')
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
})
