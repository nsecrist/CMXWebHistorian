var express = require('express'),
    fs = require('fs');
var router = express.Router();
var debug = require('debug')('cmxwebhistorian:server');

/* GET notification page. */
router.get('/', function(req, res, next) {
  res.render('notification', { title: 'Notifications' });
});

/* POST Notification from CMX */
router.post('/', function(req, res) {
  console.log(req.body);

  fs.appendFile('./public/data/data.json', JSON.stringify(req.body), function () {
      res.send('ECHO: ' + JSON.stringify(req.body));
  });
});

module.exports = router;
