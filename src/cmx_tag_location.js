/**
 * cmx_tag_location.js - Methods related to polling the CMX server for
 * current tag location data.
 */

var rp = require('request-promise');
var fs = require('fs');
var sql = require('mssql');

// CMX ENPOINTS
const base = 'http://10.21.200.7/api/location/v1'
const tags = '/tags'

/**
 * getTagLocations - Retreives ALL tag locations from CMX and returns an
 * array of JSON objects
 */
exports.getTagLocations = function() {
    return rp(base+tags, {'json': true}, function(err, res, body) {
        console.log('statusCode:', res && res.statusCode);
    })
    .auth('admin', 'S3cur32017!');
}

/**
 * Generic error handler because I am lazy and would rather 
 * @param {Error} err 
 */
exports.errorHandler = function(err) {
    console.error(err.message);
    if (err.response) {
        console.error("Response:", err.response.statusMessage);
    }
}
