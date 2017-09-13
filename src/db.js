// Contains hardcoded connection cofnigs for the DB.
// TODO:
// - Move values to configuration file
// - Provide a way to programatically change these values

const tads = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
  ,parseJSON: true
}

const cmx = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
}


/**
 * tads - Returns TADS DB config object
 *
 * @return {object}  DB Config object for msnodesqlv8
 */
exports.tads = function() {
  return tads;
}

/**
 * cmx - Returns CMX DB config object
 *
 * @return {object}  DB Config object for msnodesqlv8
 */
exports.cmx = function() {
  return cmx;
}
