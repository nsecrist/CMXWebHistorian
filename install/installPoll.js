var Service = require('node-windows').Service;

var svc = new Service({
  name: 'CMX Web Historian Poller',
  description: 'Poller service for the CMX Web Historian',
  script: 'C:\\Users\\Administrator\\Documents\\GitHub\\CMXWebHistorian\\pollerMain.js',
  nodeOptions: [
      '--harmony',
      '--max_old_space_size=4096'
  ]
});

svc.on('install', function() {
  svc.start();
});

svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
});

svc.install();