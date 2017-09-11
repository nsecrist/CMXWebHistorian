/**
 * exports - client
 *
 * Validates the input to ensure a proper client
 *
 * @param  {string} input json string to be validated as a client
 * @return {boolean}       Result of the validation
 */
exports.client = function(input) {
  var isValid = true;
  var err = '';
  var response = {};

  if(input.firstname == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.lastname == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.personnelrole != 'Client') {
    input.person = 'Client'
  };
  if(input.company != "INEOS") {
    input.company = "INEOS";
  }

  return response = {
    "valid": isValid,
    "error": err,
    "person": input
  };
}

/**
 * exports - subcontractor
 *
 * Validates the input to ensure a proper client
 *
 * @param  {string} input json string to be validated as a client
 * @return {boolean}       Result of the validation
 */
exports.subcontractor = function(input) {
  var isValid = true;
  var err = '';
  var response = {};

  if(input.firstname == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.lastname == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.personnelrole != 'Sub') {
    input.person = 'Sub'
  };
  if(input.company == null) {
    isValid = false;
    err = ' - Missing Company';
  }

  return response = {
    "valid": isValid,
    "error": err,
    "person": input
  };
}

/**
 * exports - visitor
 *
 * Validates the input to ensure a proper client
 *
 * @param  {string} input json string to be validated as a visitor
 * @return { valid: Boolean, error: String, person: { } }
 */
exports.visitor = function(input) {
  var isValid = true;
  var err = '';
  var response = {};

  if(input.firstname == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.lastname == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.personnelrole != 'Visitor') {
    input.person = 'Visitor'
  };

  return response = {
    "valid": isValid,
    "error": err,
    "person": input
  };
}
