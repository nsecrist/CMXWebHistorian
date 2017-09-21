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

const apiPool = new sql.ConnectionPool(config, err => {
  if (err) {
    console.log('Failed to open a SQL Database connection.', err.stack);
  }
});

/* GET API Docs. */
router.get('/docs', function(req, res) {
  res.render('doc', { title : "TADS API v1" });
  // res.sendfile('index.html', { root : path.join(__dirname, '../public') });
});

/* Gets all records in JCE_Personnel */
router.get('/personnel', function (req, res) {
  // apiPool.request().query('SELECT * FROM JCE_Personnel WHERE LocationTermDate IS NULL FOR JSON AUTO', (err, result) => {
  apiPool.request().query(db.personnelQuery(), (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

/* Gets record for specified JCE_PID */
router.get('/personnel/:id', function (req, res) {
  apiPool.request().input('input_parameter', sql.Int, req.params.id)
    .query('SELECT * FROM JCE_Personnel WHERE JCE_PID = @input_parameter FOR JSON AUTO', (err, result) => {
      if (err) {
        res.status(500).send('Error making sql request: ' + err.stack);
      }
      else {
        res.status(200).send(result.recordset[0][0]);
      }
    })
})

router.post('/addpersonnel/:type', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {

    switch (req.params.type) {
      case "sub":
        var v = validator.subcontractor(req.body);
        personnelPost(res, v);
        break;
      case "visitor":
        var v = validator.visitor(req.body);
        personnelPost(res, v);
        break;
      case "client":
        var v = validator.client(req.body);
        personnelPost(res, v);
        break;
      default:
        res.status(400).send('Invalid personnel type parameter: ' + req.params.type);
        break;
    }
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?');
  }
})

function personnelPost(pRes, pV) {
  if (pV.valid) {
    jsonString = JSON.stringify(pV.person);
    apiPool.request().input('json', sql.VarChar(8000), jsonString)
      .execute('person_insert', (err, result) => {
        if (err) {
          pRes.status(500).send('Error making sql request: ' + err.stack);
        }
        else {
          // Send status 201 + newly created personnel object in bodyParser
          pRes.status(201).send(result.recordset[0][0]);
        }
      })
  }
}

/* Inserts a new Personnel Record into the TADS database */
router.post('/subcontractor', function (req, res) {
  res.status(410).send('DEPRECATED: Refernce the API Documentation and use POST: /addpersonnel/{type} instead.')
  // if (req.get('Content-Type') == 'application/json') {
  //   var person = req.body;
  //   var v = validator.subcontractor(person);
  //
  //   if (v.valid) {
  //     jsonString = JSON.stringify(v.person);
  //     apiPool.request().input('json', sql.VarChar(8000), jsonString)
  //       .execute('person_insert', (err) => {
  //         if (err) {
  //           res.status(500).send('Error making sql request: ' + err.stack);
  //         }
  //         else {
  //           res.status(200).send('POST to subcontractor Successful!');
  //         }
  //       })
  //   }
  //   else {
  //     res.status(400).send('Error with JSON body format! ' + v.err);
  //   }
  // }
  // else {
  //   res.status(400).send('Did you forget to set your content-type header to json?');
  // }
})

/* Inserts a new Personnel Record into the TADS database */
router.post('/visitor', function (req, res) {
  res.status(410).send('DEPRECATED: Refernce the API Documentation and use POST: /addpersonnel/{type} instead.')
  // if (req.get('Content-Type') == 'application/json') {
  //   var person = req.body;
  //   var v = validator.visitor(person);
  //
  //   if (v.valid) {
  //     jsonString = JSON.stringify(v.person);
  //     apiPool.request().input('json', sql.VarChar(8000), jsonString)
  //       .execute('person_insert', (err) => {
  //         if (err) {
  //             res.status(500).send('Error making sql request: ' + err.stack);
  //         }
  //         else {
  //             res.status(200).send('POST to visitor Successful!');
  //         }
  //       })
  //   }
  //   else {
  //     res.status(400).send('Error with JSON body format! ' + v.err)
  //   }
  // }
  // else {
  //   res.status(400).send('Did you forget to set your content-type header to json?')
  // }
})

/* Inserts a new Personnel Record into the TADS database */
router.post('/client', function (req, res) {
  res.status(410).send('DEPRECATED: Refernce the API Documentation and use POST: /addpersonnel/{type} instead.')
  // if (req.get('Content-Type') == 'application/json') {
  //   var person = req.body;
  //   var v = validator.client(person);
  //
  //   if (v.valid) {
  //     jsonString = JSON.stringify(v.person);
  //     apiPool.request().input('json', sql.VarChar(8000), jsonString)
  //       .execute('person_insert', (err) => {
  //         if (err) {
  //           res.status(500).send('Error making sql request: ' + err.stack);
  //         }
  //         else {
  //           res.status(200).send('POST to client Successful!');
  //         }
  //       })
  //   }
  //   else {
  //     res.status(400).send('Error with JSON body format! ' + v.err)
  //   }
  // }
  // else {
  //   res.status(400).send('Did you forget to set your content-type header to json?')
  // }
})

/* Inserts a new status to the JCE_Tag_MasterList table */
router.post('/tag/status', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    tag = req.body;
    apiPool.request()
      .input('mac', sql.VarChar(12), tag.mac_address)
      .input('status', sql.VarChar(10), tag.status)
      .input('date', sql.DateTime, new Date())
      .query('INSERT INTO JCE_Tag_MasterList (MAC_Address, Tag_Status, StatusDate) VALUES (@mac, @status, @date)', err => {
        if (err) {
          res.status(500).send('Error making sql request: ' + err.stack);
        }
        else {
          res.status(200).send('POST to Tag/Status Successful!');
        }
      })
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?');
  }
})

/* Inserts or Updates the Associated status for given MAC and PID */
router.post('/associate', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    associate = req.body;
    if (!pid.pidAssigned(associate.jce_pid) && !pid.macAssigned(associate.mac_address)) {
      apiPool.request()
        .input('mac', sql.VarChar(12), associate.mac_address)
        .input('pid', sql.Int, associate.jce_pid)
        .input('date', sql.DateTime, new Date())
        .execute('associate', (err) => {
          if (err) {
            res.status(500).send('Error making sql request: ' + err.stack);
          }
          else {
            res.status(200).send('POST to Associate Successful!');
            pid.RefreshLookup();
          }
        })
    }
    else {
      res.status(409).send('Conflict, JCE_PID or MAC_ADDRESS already in use.');
    }
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

router.post('/unassociate', function (req, res) {
  if (req.get('Content-Type') == 'application/json') {
    unassociate = req.body;
    apiPool.request()
      .input('mac', sql.VarChar(12), unassociate.mac_address)
      .input('date', sql.DateTime, new Date())
      .execute('unassociate', (err) => {
        if (err) {
          res.status(500).send('Error making sql request: ' + err.stack);
        }
        else {
          res.status(200).send('POST to Unassociate Successful!');
          pid.RefreshLookup();
        }
      })
  }
  else {
    res.status(400).send('Did you forget to set your content-type header to json?')
  }
})

router.get('/views/available_tags', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_AvailableTags FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/current_tags', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_CurrentTagsDetail FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/all_tags/status', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_CurrentTagStatusCount FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/all_tags', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_AllTags FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/assigned_tags_with_personnel', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_AssignedTagsWithPersonnel FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/lost_tags', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_LostTags FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/views/current_tags_detail', function (req, res) {
  apiPool.request().query('SELECT * FROM V_JCE_CurrentTagsDetail FOR JSON AUTO', (err, result) => {
    if (err) {
      res.status(500).send('Error making sql request: ' + err.stack);
    }
    else {
      res.status(200).send(result.recordset[0]);
    }
  })
})

router.get('/tags/available_tags', function (req, res) {
  res.status(410).send('DEPRECATED: Use /views/available_tags instead.');
})

router.get('/tags/current_tags', function (req, res) {
  res.status(410).send('DEPRECATED: Use /views/current_tags instead.');
})

router.get('/tags/current_tags/status', function (req, res) {
  res.status(410).send('DEPRECATED: Use /views/current_tags/status instead.');
})

module.exports = router;
