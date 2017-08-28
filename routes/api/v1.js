var express = require('express');
var router = express.Router();
var sql = require('mssql/msnodesqlv8');
var path = require('path');
// var bodyParser = require('body-parser');

var config = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
  ,parseJSON: true
}

const pool = new sql.ConnectionPool(config, err => {
  if (err) {
    console.log('Failed to open a SQL Database connection.', err.stack);
  }
});

/* GET API Docs. */
router.get('/docs', function(req, res, next) {
  res.render('doc2', { title : "TADS API v1" });
  // res.sendfile('index.html', { root : path.join(__dirname, '../public') });
});

/*
GET: /tas/api/v1/personnel
GET: /tas/api/v1/personnel/{pid}

POST: /tas/api/v1/associate
Arguments in body: pId, macAddress

POST: /tas/api/v1/unassociate
Arguments in body: macAddress
*/

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
          res.status(200).send(result.recordset);
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
          .input('pid', sql.Int, associate.pid)
          .input('date', sql.DateTime, new Date())
          .execute('associate', (err) => {
            if (err) {
              res.status(500).send('Error making sql request: ' + err.stack);
              sql.close();
            }
            else {
              res.status(201).send('POST to Associate Successful!');
              sql.close();
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
              res.status(201).send('POST to Unassociate Successful!');
              sql.close();
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
