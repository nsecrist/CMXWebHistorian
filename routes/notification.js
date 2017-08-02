var express = require('express'),
    fs = require('fs');
var router = express.Router();
var path = require('path');

var dataDir = './public/data/';

/* GET notification page. */
router.get('/', function(req, res, next) {
  res.render('notification', { title: 'Notifications' });
});

/* POST Notification from CMX */
router.post('/', function(req, res) {
  console.log(req.body);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.appendFile(path.join(dataDir, 'data.json'), JSON.stringify(req.body), function () {
      res.send('ECHO: ' + JSON.stringify(req.body));
  });
});

module.exports = router;
