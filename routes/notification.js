var express = require('express'),
    fs = require('fs');
var router = express.Router();
var path = require('path');
var sql = require('mssql/msnodesqlv8');
var db = require('../src/db.js');
var pid = require('../src/pid_lookup.js');

// var config = {
//   driver: 'msnodesqlv8',
//   connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={SecristTestDB};Trusted_Connection={yes};'
// }

var config = db.tads();

var dataDir = './public/data/'

const parameter = 'Location_NotificationJson';
const sp = 'Location_NotificationInsertJson';

/* GET notification page. */
router.get('/', function(req, res, next) {
  res.render('notification', { title: 'Notifications' });
});

/* POST Notification from CMX */
router.post('/', function(req, res) {
  var dt = new Date();
  var utcDate = dt.toUTCString();
  // console.log(utcDate + " -- POST to notification received.")

  // needed for the fs.appendfile debug output below
  // if (!fs.existsSync(dataDir)) {
  //   fs.mkdirSync(dataDir);
  // }

  // Get the notification
  var notifications = req.body.notifications;

  // notification.jce_pid = "-1";
  // body = JSON.stringify(notification);

  processArray(notifications, function(notification) {
    // Pass in the notification object, and return it with the added personnel info
    // then stringify the object and use it to call the stored procedure
    body = JSON.stringify(pid.Lookup(notification));

    // json = body.substring(18, body.lastIndexOf('}')-1);

    // debug output
    // console.log(body);

    // more debug output
    // fs.appendFile(path.join(dataDir, 'data.json'), body + '\n');


    const pool = new sql.ConnectionPool(config, err => {
      pool.request()
        .input(parameter, sql.VarChar(8000), body)
        .execute(sp, (err) => {
          // ... error checks
          if (err) {
            console.log(err);
            var dt = new Date();
            var utcDate = dt.toUTCString();
            result = utcDate + ' -- ' + sp + ' failed.'
          }
          else {
            var dt = new Date();
            var utcDate = dt.toUTCString();
            result = utcDate + ' -- ' + sp + ' was successful.'
          }
          // console.log(result);
        });
        if (err) {
          console.log(err);
        }

        pool.request()
          .input(parameter, sql.VarChar(8000), body)
          .execute('Location_CVT_Insert', (err) => {
            // ... error checks
            if (err) {
              console.log(err);
              var dt = new Date();
              var utcDate = dt.toUTCString();
              result = utcDate + ' -- ' + 'Location_CVT_Insert' + ' failed.'
            }
            else {
              var dt = new Date();
              var utcDate = dt.toUTCString();
              result = utcDate + ' -- ' + 'Location_CVT_Insert' + ' was successful.'
            }
            // console.log(result);
          });
          if (err) {
            console.log(err);
          }
        });
  res.sendStatus(200);
  })
});

/* GET notification page. */
router.post('/battery_life', function(req, res, next) {
  notification = req.body.notifications[0];

  // needed for the fs.appendfile debug output below
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // more debug output
  fs.appendFile(path.join(dataDir, 'battery_life.json'), notification + '\n');

});

function processArray(items, process) {
  var todo = items.concat();

  setTimeout(function() {
    process(todo.shift());
    if (todo.length > 0) {
      setTimeout(arguments.callee, 25);
    }
  }, 25);
}

module.exports = router;
