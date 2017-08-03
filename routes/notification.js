var express = require('express'),
    fs = require('fs');
var router = express.Router();
var path = require('path');
var sql = require('mssql/msnodesqlv8');

var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={10.4.160.113\\JCE};Database={SecristTestDB};Trusted_Connection={yes};'
}

const parameter = 'Location_NotificationJson';
const sp = 'Location_NotificationInsertJson';

/* GET notification page. */
router.get('/', function(req, res, next) {
  res.render('notification', { title: 'Notifications' });
});

/* POST Notification from CMX */
router.post('/', function(req, res) {

  const pool = new sql.ConnectionPool(config, err => {
    pool.request()
      .input(parameter, sql.VarChar(8000), JSON.stringify(req.body))
      .execute(sp, (err) => {
        // ... error checks
        if (err) {
          console.dir(err);
          result = sp + ' failed.'
        }
        else {
          result = sp + ' was successful.'
        }
        console.dir(result);
      });
      if (err) {
        console.dir(err);
      }
  });

  // console.log(req.body);

  // if (!fs.existsSync(dataDir)) {
  //   fs.mkdirSync(dataDir);
  // }
  //
  // fs.appendFile(path.join(dataDir, 'data.json'), JSON.stringify(req.body), function () {
  //     res.send('ECHO: ' + JSON.stringify(req.body));
  // });
});

module.exports = router;
