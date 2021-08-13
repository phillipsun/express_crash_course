const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const path = require('path')
const memberList = require('../Members')
const app = require('../index')
chai.use(chaiHttp)
const request = require('request')
const sinon = require('sinon')
const should = chai.should();
const router = require('../routes/api/members')

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

  // it('GET members should return an array', (done) => {
  //   chai
  //     .request(app)
  //     .get('/api/members')
  //     .end(function (err, res) {
  //       expect(res).to.have.status(200)
  //       expect(res.body).to.be.an('array')
  //       done()
  //     })
  // })

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

  var requester = chai.request(app).keepOpen()
  beforeEach(() => {
    this.get = sinon.stub(requester, 'get').returns({ hi: 'hello '});
  });

  afterEach(() => {
    requester.get.restore();
  });

  describe('GET all members', () => {
    const responseObject = {
      statusCode: 200,
      headers: {
        'content-type': 'application/json'
      }
    };
    const responseBody = {
      status: 'success',
      data: [
        {
          id: 4,
          name: 'The Land Before Time',
          genre: 'Fantasy',
          rating: 7,
          explicit: false
        },
        {
          id: 5,
          name: 'Jurassic Park',
          genre: 'Science Fiction',
          rating: 9,
          explicit: true
        },
        {
          id: 6,
          name: 'Ice Age: Dawn of the Dinosaurs',
          genre: 'Action/Romance',
          rating: 5,
          explicit: false
        }
      ]
    };
    it('should return all movies', (done) => {


      chai.request(app).get('/api/members').end((err, res) => {
        expect(res).not.to.be.null
        done()
      })




      ///////

      // Promise.all([
      //   requester.get('/api/members'),
      // ])
      // .then(responses => console.log(responses[0]))
      // .then(() => {
      //   requester.close()
      //   done()
      // })



      /////


      // this.get.yields(null, responseObject, JSON.stringify(responseBody));
      // request.get('http://localhost:5000/api/members', (err, res, body) => {
      //   // there should be a 200 status code
      //   res.statusCode.should.eql(200);
      //   // the response should be JSON
      //   res.headers['content-type'].should.contain('application/json');
      //   // parse response body
      //   body = JSON.parse(body);
      //   // the JSON response body should have a
      //   // key-value pair of {"status": "success"}
      //   body.status.should.eql('success');
      //   // the JSON response body should have a
      //   // key-value pair of {"data": [3 movie objects]}
      //   body.data.length.should.eql(3);
      //   // the first object in the data array should
      //   // have the right keys
      //   body.data[0].should.include.keys(
      //     'id', 'name', 'genre', 'rating', 'explicit'
      //   );
      //   // the first object should have the right value for name
      //   body.data[0].name.should.eql('The Land Before Time');
      //   done();
      // });
    });
  });
})
