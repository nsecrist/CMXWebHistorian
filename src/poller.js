var cmx = require('./cmx_tag_location');
var sql = require('mssql');
var Promise = require('bluebird');
var moment = require('moment');

const pool = new sql.ConnectionPool({
    user: 'webapp',
    password: 'webapp',
    server: 'localhost\\JCE',
    database: 'JCE'
}, err => {
    if(err) {
        console.error(err.name, ':', err.message);
    };
});

/**
 * Adds a PID value to the Tag info retreived from CMX
 * @param {object} pTag - The Tag Object from CMX
 * @yields {number} pID from SQL server
 * 
 * The yield keyword forces the assignment of the jcePid value to
 * wait for the pid promise to resolve with the recordset from the DB.
 * Without this, the statements will run asynchronously causing the pTag
 * object to be returned before the pid value can be retreived from the
 * DB and appended to the pTag object.
 */
var addPersonnelId = Promise.coroutine(function* (pTag) {
    var pid = yield pool.request()
                    .input('macAddress', sql.VarChar(12), pTag.macAddress.replace(/:/g, "").toUpperCase().trim())
                    .query('select coalesce((select JCE_PID from V_JCE_CurrentTagsDetail where MAC_Address = @macAddress), -1) as pid')
    pTag.jcePid = pid.recordset[0].pid;
    return pTag;
});

/**
 * Checks for unassigned jcePid values before writing to the database
 * @param {object} pTag - The pTag object, should have a jcePid value
 * @returns {Promise}
 */
var writeToDB = function(pTag) {
    if (pTag.jcePid > -1) {
        return pool.request()
        .input('Location_History_Json', sql.VarChar(8000), JSON.stringify(pTag))
        .execute('Location_History_Insert');
    }
    else {
        return new Promise((resolve, reject) => {
            resolve("Tag not assigned!");
        });
    }
};

/**
 * Routine responsible for getting Tag objects from CMX, appending
 * the appropriate jcePid value, and writing the Tag info to the DB
 */
exports.poll = function() {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'), '- Polling...');
    cmx.getTagLocations()
    .then(function(body) {
        // Do something with JSON body here
        // Log the number of retreived tags
        console.log("Successfully retreived " + body.length + " tags.");
        return Promise.all(body.map(element => {
            return addPersonnelId(element);
        }));
    }).then(results => {
        console.log("Number of resolved Promises:", results.length);
        return Promise.all(results.map(element => {
            return writeToDB(element);
        }))
    })
    .then(function() {
        console.log(moment().format('MMMM Do YYYY, h:mm:ss a'), '- Complete!');
    })
    .catch(cmx.errorHandler);
}