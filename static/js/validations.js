var validator = require('validator');
const logger = require('../../src/utils/logger');
//  user validation

exports.userValidation = (req) => {
  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('email', 'email must be an Email').isEmail();
  req.checkBody('role', 'role is required').notEmpty();
  req.checkBody('branch', 'branch is required').notEmpty();

  return req.validationErrors();
};

function testing1(ob) {
  validator.isEmail(ob.email);
  if (validator.validationErrors) {
    return true;
  } else {
    return false;
  }
}
function testing(ob) {
  return testing1(ob);
}

exports.checkb = (req, res, next) => {
  req.body.email = 'jdflksjfls';
  logger.info(testing1(req.body));
};
