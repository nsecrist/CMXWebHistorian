process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

/* Test the GET Personnel route */
describe('/GET Persons', () => {
  is('it should GET all the persons', (done) => {
    chai.request(app)
      .get('/personnel')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.above(0);
        done();
      });
  });
});
