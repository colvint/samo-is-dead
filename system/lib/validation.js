const Joi = require('@hapi/joi');

const isValid = (validator, object) => {
  try {
    Joi.assert(object, validator);

    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  isValid
};
