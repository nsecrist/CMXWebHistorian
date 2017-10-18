var sql = require('mssql/msnodesqlv8');
var db = require('./db.js');

var config = db.tads();

const pool = new sql.ConnectionPool(config, err => {
  if (err) {
    console.log('Failed to open a SQL Database connection.', err.stack);
  }
});

// var config = {
//   driver: 'msnodesqlv8'
//   ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost};Database={JCE};Trusted_Connection={yes};'
//   ,parseJSON: true
// }

var hTable;
var initialized = false;


/**
 * RefreshLookup - Refreshes PID Lookup Hash Object from TADS DB View
 *
 * @return {boolean}  True if lookup refresh was successful
 */
exports.RefreshLookup = function() {
  pool.request().query('SELECT * FROM V_JCE_CurrentTagsDetail FOR JSON AUTO', (err, result) => {
    if (err) {
      sql.close();
      console.log("Error refreshing PID Hashtable: " + err);
      return false;
    }
    else {
      // set hTable to query results
      hTable = result.recordset[0];
      // console.log("hTable: " + hTable);
      // res.status(200).send(result.recordset[0]);
      // console.log("Sucessful Hashtable refresh!");
      return true;
    }
  })
}


/**
 * pidAssigned - Provides a way to check if a pid is currently assigned to a tag
 *
 * @param  {int} pPid     The JCE_PID to look up in the hTable
 * @return {boolean}      Returns True if the provided pid is already assigned a Tag
 */
exports.pidAssigned = function(pPid) {
  if (hTable != undefined) {
    for (var i = 0; i < hTable.length; i++) {
      if (hTable[i].JCE_PID == pPid) {
        return true;
      }
    }
    return false;
  }
  else {
   return false;
  }
}

/**
 * macAssigned - Provides a way to check if a tag is currently assigned to a pid
 *
 * @param  {int} pDeviceID     The deviceID to look up in the hTable
 * @return {boolean}      Returns True if the provided tag is already assigned a pid
 */
exports.macAssigned = function(pDeviceID) {
  if (hTable != undefined) {
    for (var i = 0; i < hTable.length; i++) {
      if (hTable[i].MAC_Address == pDeviceID) {
        return true;
      }
    }
    return false;
  }
  else {
   return false;
  }
}

/**
 * Lookup - Returns a Notification object with the jce.pid attribute added
 *
 * @param  {object} pNotification Notification object from CMX
 * @return {object}               Notification object with jce_pid attribute set
 */
exports.Lookup = function(pNotification) {
  var found = false;

  if (hTable == undefined && initialized == false) {
    // console.log("hTable has not been initialized, doing so now...")
    this.RefreshLookup();
    initialized = true;
  }

  if (hTable != undefined) {
    for (var i = 0; i < hTable.length; i++) {
      if (hTable[i].MAC_Address == pNotification.deviceId.replace(/:/g, "").toUpperCase()) {
        pNotification.jce_pid = hTable[i].JCE_PID;
        pNotification.crewcode = hTable[i].CrewCode;
        found = true;
        break;
      }
    }
    //
    // foreach (tag in hTable) {
    //   if (tag.deviceId = pNotification.deviceId) {
    //     pNotification.jce_pid = tag.jce_pid
    //     found = true;
    //     break;
    //   }
    if (!found) {
      // console.log("Unable to find jce_pid match!");
      pNotification.jce_pid = "-1";
    }
  } else {
    // console.log("hTable is Undefined, -1 values for everyone!");
    pNotification.jce_pid = "-1";
  }
  return pNotification;
}
