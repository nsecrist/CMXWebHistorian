var p = require('./src/poller');

setInterval(p.poll, 60000);
