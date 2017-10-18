// Contains hardcoded connection configs for the DB.
// TODO:
// - Provide a way to programatically change these values
// - Consolidate the use of the sql related calls to here.

const config = require('config');

const tads = {
  driver: 'msnodesqlv8'
  ,connectionString: config.DBHost
  ,parseJSON: true
}

/**
 * tads - Returns TADS DB config object
 *
 * @return {object}  DB Config object for msnodesqlv8
 */
exports.tads = function() {
  return tads;
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
