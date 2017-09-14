var express = require('express');
var router = express.Router();
var sql = require('mssql/msnodesqlv8');
var path = require('path');
var db = require('../../src/db.js');
var pid = require('../../src/pid_lookup.js');
// var bodyParser = require('body-parser');

var validator = require('../../src/tads_validator.js');

// var config = {
//   driver: 'msnodesqlv8'
//   ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
//   ,parseJSON: true
// }

var config = db.tads();

const pool = new sql.ConnectionPool(config, err => {
  if (err) {
    console.log('Failed to open a SQL Database connection.', err.stack);
  }
});

/* GET API Docs. */
router.get('/docs', function(req, res, next) {
  res.render('doc', { title : "TADS API v1" });
  // res.sendfile('index.html', { root : path.join(__dirname, '../public') });
});

/* Gets all records in JCE_Personnel */
router.get('/personnel', function (req, res) {
  sql.connect(config, err => {
    if (err) {
      res.status(500).send('Error connecting to database. Error: ' + err.stack);
    }
    else {
      new sql.Request().query('SELECT * FROM JCE_Personnel FOR JSON AUTO', (err, result) => {
        if (err) {
          res.status(500).send('Error making sql request: ' + err.stack);
          sql.close();
        }
        else {
          res.status(200).send(result.recordset[0]);
          sql.close();
        }
      })
    }
  })
})

/* Gets record for specified JCE_PID */
router.get('/personnel/:id', function (req, res) {
  sql.connect(config, err => {
    if(err) {
      res.status(500).send('Error connection to database. Error: ' + err.stack);
    }
    else {
      new sql.Request()
        .input('input_parameter', sql.Int, req.params.id)
        .query('SELECT * FROM JCE_Personnel WHERE JCE_PID = @input_parameter FOR JSON AUTO', (err, result) => {
          if (err) {
            res.status(500).send('Error making sql request: ' + err.stack);
            sql.close();
          }
          else {
            res.status(200).send(result.recordset);
            sql.close();
          }
        })
    }
  })
})

/* Inserts a new Personnel Record into the TADS database */
router.post('/subcontractor', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    var person = req.body;
    var v = validator.subcontractor(person);

    if (v.valid) {
      jsonString = JSON.stringify(v.person);
      sql.connect(config, err => {
        if(err) {
          res.status(500).send('Error connecting to database. Error: ' + err.stack);
        }
        else {
          new sql.Request()
            .input('json', sql.VarChar(8000), jsonString)
            .execute('person_insert', (err) => {
              if (err) {
                res.status(500).send('Error making sql request: ' + err.stack);
                sql.close();
              }
              else {
                res.status(200).send('POST to subcontractor Successful!');
                sql.close();
              }
            })
        }
      })
    }
    else {
      res.status(400).send('Error with JSON body format! ' + v.err)
    }
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

/* Inserts a new Personnel Record into the TADS database */
router.post('/visitor', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    var person = req.body;
    var v = validator.visitor(person);

    if (v.valid) {
      jsonString = JSON.stringify(v.person);
      sql.connect(config, err => {
        if(err) {
          res.status(500).send('Error connecting to database. Error: ' + err.stack);
        }
        else {
          new sql.Request()
            .input('json', sql.VarChar(8000), jsonString)
            .execute('person_insert', (err) => {
              if (err) {
                res.status(500).send('Error making sql request: ' + err.stack);
                sql.close();
              }
              else {
                res.status(200).send('POST to visitor Successful!');
                sql.close();
              }
            })
        }
      })
    }
    else {
      res.status(400).send('Error with JSON body format! ' + v.err)
    }
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

/* Inserts a new Personnel Record into the TADS database */
router.post('/client', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    var person = req.body;
    var v = validator.client(person);

    if (v.valid) {
      jsonString = JSON.stringify(v.person);
      sql.connect(config, err => {
        if(err) {
          res.status(500).send('Error connecting to database. Error: ' + err.stack);
        }
        else {
          new sql.Request()
            .input('json', sql.VarChar(8000), jsonString)
            .execute('person_insert', (err) => {
              if (err) {
                res.status(500).send('Error making sql request: ' + err.stack);
                sql.close();
              }
              else {
                res.status(200).send('POST to client Successful!');
                sql.close();
              }
            })
        }
      })
    }
    else {
      res.status(400).send('Error with JSON body format! ' + v.err)
    }
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

/* Inserts or Updates the Associated status for given MAC and PID */
router.post('/associate', function (req, res) {

  if (req.get('Content-Type') == 'application/json') {
    associate = req.body;

    sql.connect(config, err => {
      if(err) {
        res.status(500).send('Error connecting to database. Error: ' + err.stack);
      }
      else {
        new sql.Request()
          .input('mac', sql.VarChar(12), associate.mac_address)
          .input('pid', sql.Int, associate.jce_pid)
          .input('date', sql.DateTime, new Date())
          .execute('associate', (err) => {
            if (err) {
              res.status(500).send('Error making sql request: ' + err.stack);
              sql.close();
            }
            else {
              res.status(200).send('POST to Associate Successful!');
              sql.close();
              pid.RefreshLookup();
            }
          })
      }
    })
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

router.post('/unassociate', function (req, res) {

  if (req.get('Content-Type') == 'application/json') {
    unassociate = req.body;

    sql.connect(config, err => {
      if(err) {
        res.status(500).send('Error connecting to database. Error: ' + err.stack);
      }
      else {
        new sql.Request()
          .input('mac', sql.VarChar(12), unassociate.mac_address)
          .input('date', sql.DateTime, new Date())
          .execute('unassociate', (err) => {
            if (err) {
              res.status(500).send('Error making sql request: ' + err.stack);
              sql.close();
            }
            else {
              res.status(200).send('POST to Unassociate Successful!');
              sql.close();
              pid.RefreshLookup();
            }
          })
      }
    })
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

module.exports = router;
