var express = require('express');
var router = express.Router();
var sql = require('mssql/msnodesqlv8');
var fs = require('fs');

/* SQL Server Configuration */
// var config = {
//   user: 'cmxtest',
//   password: 'CMXT3st2017',
//   server: '10.4.160.113\\JCE',
//   database: 'SecristTestDB'
// }

var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={10.4.160.113\\JCE};Database={SecristTestDB};Trusted_Connection={yes};'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Person Import Json' });

  var json = null;

  fs.open('./public/data/person.json', 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('File does not exist');

        return;
      }
      throw err;
    }
    json = fs.readFileSync('./public/data/person.json', 'utf8');
  })

    const pool = new sql.ConnectionPool(config, err => {
      pool.request()
        .input('json', sql.VarChar(8000), json)
        .execute('PersonInsertJson', (err) => {
          // ... error checks
          if (err) {
            console.dir(err);
            result = 'Person insert from JSON failed.'
          }
          else {
            result = 'Person insert from JSON was successful.'
          }
          console.dir(result);
        });
        if (err) {
          console.dir(err);
        }
    });
});

module.exports = router;
