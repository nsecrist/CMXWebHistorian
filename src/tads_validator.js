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

  if(input.FirstName == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.LastName == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.PersonnelRole != 'Client') {
    input.person = 'Client'
  };

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

  if(input.FirstName == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.LastName == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.PersonnelRole != 'Sub') {
    input.person = 'Sub'
  };

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

  if(input.FirstName == null) {
    isValid = false;
    err += ' - Missing FirstName';
  };
  if(input.LastName == null) {
    isValid = false;
    err = ' - Missing LastName';
  };
  if(input.PersonnelRole != 'Visitor') {
    input.person = 'Visitor'
  };

  return response = {
    "valid": isValid,
    "error": err,
    "person": input
  };
}
