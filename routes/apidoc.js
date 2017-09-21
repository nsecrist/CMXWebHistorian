var express = require('express');
var router = express.Router();
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('./documentation/api/v1/tads_swagger.yaml');

// router.get('/', function(req, res) {
//   res.send(swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// })

router.use(swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
