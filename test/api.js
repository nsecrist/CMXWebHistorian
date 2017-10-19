process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');
var pid = require('../src/pid_lookup.js');
var should = chai.should();

chai.use(chaiHttp);

const apiRoute = '/tads/api/v1';

var ids = [];

// // Test the GET Personnel route with a non-existant JCE_PID
// describe('/GET personnel/{id}', () => {
//   it('it should GET the specified person', (done) => {
//     chai.request(server)
//       .get(apiRoute.concat('/personnel/10000'))
//       .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('string');
//         done();
//       });
//   });
// });

// Test the addpersonnel/sub router (No payload errors)
describe('/POST addpersonnel/sub', function (req, res) {
  it('it should POST a new sub to DB and return the new sub in response', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/addpersonnel/sub'))
      .set('Content-Type', 'application/json')
      .send({ firstname: 'Unit'
              ,middlename: 'Test'
              ,lastname: 'Sub'
              ,company: 'Unit Testing Inc'
              ,personnelrole: 'Sub' })
      .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('FirstName', 'Unit');
          res.body.should.have.property('LastName', 'Sub');
          res.body.should.have.property('Company', 'Unit Testing Inc');
          res.body.should.have.property('JCE_PID');
          ids.push(res.body.JCE_PID);
        done();
      });
  });
});

// Test the addpersonnel/client router (No payload errors)
describe('/POST addpersonnel/client', function (req, res) {
  it('it should POST a new client to DB and return the new client in response', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/addpersonnel/client'))
      .set('Content-Type', 'application/json')
      .send({ firstname: 'Unit'
              ,middlename: 'Test'
              ,lastname: 'Client'
              ,personnelrole: 'Client'})
      .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('FirstName', 'Unit');
          res.body.should.have.property('LastName', 'Client');
          res.body.should.have.property('Company', 'INEOS');
          res.body.should.have.property('JCE_PID');
          ids.push(res.body.JCE_PID);
        done();
      });
  });


});

// Test the addpersonnel/visitor route (No payload errors)
describe('/POST addpersonnel/visitor', function (req, res) {
  it('it should POST a new visitor to DB and return the new visitor in response', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/addpersonnel/visitor'))
      .set('Content-Type', 'application/json')
      .send({ firstname: 'Unit'
              ,middlename: 'Test'
              ,lastname: 'Visitor'
              ,personnelrole: 'Visitor'})
      .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('FirstName', 'Unit');
          res.body.should.have.property('LastName', 'Visitor');
          res.body.should.have.property('Company', 'Visitor');
          res.body.should.have.property('JCE_PID');
          ids.push(res.body.JCE_PID);
        done();
      });
  });
});

describe('/GET /personnel', function () {
  // Test the GET Personnel route
  describe('All Personnel', function () {
    it('it should GET all the persons', (done) => {
      chai.request(server)
        .get(apiRoute.concat('/personnel'))
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('array');
            res.body.length.should.be.above(0);
          done();
        });
    });
  });

  // Test the GET Personnel route with specified JCE_PID
  describe('Specified Person /{id}', function () {
    it('it should GET the specified person', (done) => {
      chai.request(server)
        .get(apiRoute.concat('/personnel/' + ids[0]))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('JCE_PID', ids[0]);
        done();
      });
    });
  
    it('it should respond with a 404 not found status');
  });
});

describe('/POST /associate', function(req, res) {

  before(function() {
    pid.RefreshLookup();
  });

  beforeEach(function (done) {
    setTimeout(done, 1000);
  })

  // Test associate tag endpoint (No payload errors)
  it('it should respond with a 200 OK status', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/associate'))
      .set('Content-Type', 'application/json')
      .send({ mac_address: '00AA11BB22CC'
              ,jce_pid: ids[0] })
      .end((err, res) => {
          res.should.have.status(200);
        done();
      });
  });

  // Test associate tag endpoint (already assigned tag)
  describe('Unavailable Tag', function () {
    it('it should respond with a 409 CONFLICT status', (done) => {
      chai.request(server)
        .post(apiRoute.concat('/associate'))
        .set('Content-Type', 'application/json')
        .send({ mac_address: '00AA11BB22CC'
                ,jce_pid: ids[1] })
        .end((err, res) => {
            res.should.have.status(409);
          done();
        });
    });
  });

  // Test associate tag endpoint (already assigned pid)
  describe('Unavailable PID', function () {
    it('it should respond with a 409 CONFLICT status', (done) => {
      chai.request(server)
        .post(apiRoute.concat('/associate'))
        .set('Content-Type', 'application/json')
        .send({ mac_address: '11AA11BB22CC'
                ,jce_pid: ids[0] })
        .end((err, res) => {
            res.should.have.status(409);
          done();
        });
    });
  });

  // Test associate tag endpoint (Test Case Sensitivity)
  describe('MAC Address case sensitivity', function () {
    it('it should respond with a 409 CONFLICT status', (done) => {
      chai.request(server)
        .post(apiRoute.concat('/associate'))
        .set('Content-Type', 'application/json')
        .send({ mac_address: '00aa11bb22cc'
                ,jce_pid: ids[0] })
        .end((err, res) => {
            res.should.have.status(409);
          done();
        });
    });
  });
});

// Test the GET views/assigned_tags_with_personnel route
describe('/GET views/assigned_tags_with_personnel', () => {
  it('it should GET all the assigned tags and associated jce_pid', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/views/assigned_tags_with_personnel'))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        done();
      });
  });
});

// Test unassociate tag endpoint (no payload errors)
describe('/POST /unassociate', function(req, res) {
  it('it should respond with a 200 OK status', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/unassociate'))
      .set('Content-Type', 'application/json')
      .send({ mac_address: '00AA11BB22CC'
              ,jce_pid: ids[0] })
      .end((err, res) => {
          res.should.have.status(200);
        done();
      });
  });
});

// Test the GET views/available_tags route
describe('/GET views/available_tags', () => {
  it('it should GET all the current tags', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/views/available_tags'))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        done();
      });
  });
});

// Test the GET views/current_tags route
describe('/GET views/current_tags', () => {
  it('it should GET all the current tags', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/views/current_tags'))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        done();
      });
  });
});

// Test the GET views/all_tags/status route
describe('/GET views/all_tags/status', () => {
  it('it should GET all the status of tags', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/views/all_tags/status'))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        done();
      });
  });
});

// Test the GET views/lost_tags route
describe('/GET views/lost_tags', () => {
  it('it should GET all the tags whose status is LOST');
});

// Test the GET views/current_tags_detail route
describe('/GET views/current_tags_detail', () => {
  it('it should GET all the currently assigned tags and personnel meta data', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/views/current_tags_detail'))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        done();
      });
  });
});

// Test DEPRECATED endpoints
describe('/POST /client', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/client'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

describe('/POST /visitor', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/visitor'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

describe('/POST /subcontractor', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .post(apiRoute.concat('/subcontractor'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

describe('/GET /tags/available_tags', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/tags/available_tags'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

describe('/GET /tags/current_tags', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/tags/current_tags'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

describe('/GET /tags/current_tags/status', function(req, res) {
  it('it should respond with a 410 GONE status', (done) => {
    chai.request(server)
      .get(apiRoute.concat('/tags/current_tags/status'))
      .end((err, res) => {
          res.should.have.status(410);
        done();
      });
  });
});

// describe('/DELETE /personnel/{id}', function(req, res) {
//   it('it should delete the specified record and return a 200 OK status', (done) => {
//     ids.forEach(function(element) {
//       chai.request(server)
//         .delete(apiRoute.concat('/personnel/' + element))
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.propery('jce_pid');
//         });
//     });
//     done();
//   });
// });
