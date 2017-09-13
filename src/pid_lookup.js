var sql = require('mssql/msnodesqlv8');
var db = require('./db.js');

// var config = db.tads();

var config = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
  ,parseJSON: true
}

var hTable = {};


/**
 * RefreshLookup - Refreshes PID Lookup Hash Object from TADS DB View
 *
 * @return {boolean}  True if lookup refresh was successful
 */
exports.RefreshLookup = function() {
  sql.connect(config, err => {
    if (err) {
      // Handle connection error here
      console.log("SQL Connection Error: " + err);
      return false;
    }
    else {
      new sql.Request().query('SELECT * FROM V_JCE_CurrentTags FOR JSON AUTO', (err, result) => {
        if (err) {
          sql.close();
          console.log("Error refreshing PID Hashtable: " + err);
          return false;
        }
        else {
          // set hTable to query results
          hTable = result.recordset[0];
          // res.status(200).send(result.recordset[0]);
          sql.close();
          console.log("Sucessful Hashtable refresh!");
          return true;
        }
      })
    }
  })
}

/**
 * Lookup - Returns the JCE_PID for the supplied DeviceID.
 *
 * @param  {string} pDeviceID MAC_ADDRESS of the device for lookup
 * @return {string}           Associated PID of DeviceID, NULL if unassociated
 */
exports.Lookup = function(pDeviceID) {
  console.log("In PID.Lookup!");
  // if (hTable == null) {
  //   RefreshLookup();
  // }
  //
  // return hTable.pDeviceID;
  //
  return "-1";
}
