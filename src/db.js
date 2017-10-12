// Contains hardcoded connection cofnigs for the DB.
// TODO:
// - Move values to configuration file
// - Provide a way to programatically change these values
// - Consolidate the use of the sql related calls to here.

const tads = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost\\JCE};Database={JCE};Trusted_Connection={yes};'
  ,parseJSON: true
}

const cmx = {
  driver: 'msnodesqlv8'
  ,connectionString: 'Driver={SQL Server Native Client 11.0};Server={localhost\\JCE};Database={JCE};Trusted_Connection={yes};'
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

exports.personnelQuery = function() {
  return 'SELECT * ' +
  'FROM ( ' +
  		'SELECT ' +
        'JCE_Personnel.JCE_PID ' +
        ',PersonnelRole ' +
        ',FirstName ' +
        ',MiddleName ' +
        ',LastName ' +
        ',Suffix ' +
        ',HireDate ' +
        ',LocalJacobsBadgeID ' +
        ',CRCode_FunctionCode ' +
        ',EmployeeNumber ' +
        ',OraclePartyID ' +
        ',HRJobTitle ' +
        ',LocalJobTitle ' +
        ',Department ' +
        ',Shift ' +
        ',Skill ' +
        ',Class ' +
        ',CrewCode ' +
        ',Status ' +
        ',JacobsStartDate ' +
        ',LocationStartDate ' +
        ',LocationTermDate ' +
        ',DateLastChange ' +
        ',Company ' +
        ',Phone ' +
        ',V_JCE_CurrentTags.MAC_Address as MAC_Address ' +
        ',V_JCE_CurrentTags.DateAssigned as DateAssigned ' +
  		'FROM JCE_Personnel ' +
      'FULL OUTER JOIN V_JCE_CurrentTags  ' +
      'ON JCE_Personnel.JCE_PID = V_JCE_CurrentTags.JCE_PID) ' +
  'AS x ' +
  'WHERE x.LocationTermDate IS NULL FOR JSON AUTO'
}
