var Service = require('node-windows').Service;

var svc = new Service({
  name: 'CMX Web Historian Poller',
  script: require('path').join(__dirname, 'pollerMain.js')
});

svc.on('uninstall', function() {
  console.log('Uninstall of ' + svc.name + ' complete.');
  console.log('The service exists: ', svc.exists);
});

svc.uninstall();
