const Joi = require('@hapi/joi');

const { ACCOUNTS_CREATION_REQUESTED_BY_CLIENT } = require('../events');

const ACCOUNTS_CREATION_REQUESTED_BY_CLIENT_VALIDATOR = Joi.object({
  data: Joi.object({
    count: Joi.number().integer().min(1).max(5).required()
  }).required()
});

module.exports = {
  [ACCOUNTS_CREATION_REQUESTED_BY_CLIENT]: ACCOUNTS_CREATION_REQUESTED_BY_CLIENT_VALIDATOR,
};
