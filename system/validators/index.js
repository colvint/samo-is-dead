const Joi = require('@hapi/joi');

const { ACCOUNTS_CREATION_REQUESTED_BY_CLIENT } = require('../events/types');
const { CREATE_ACCOUNTS } = require('../actions/types');

const ACCOUNTS_CREATION_REQUESTED_BY_CLIENT_VALIDATOR = Joi.object({
  data: Joi.object({
    count: Joi.number().integer().min(1).max(5).required()
  }).required()
});

const CREATE_ACCOUNTS_VALIDATOR = Joi.object({
  data: Joi.object({
    counts: Joi.number().integer().min(1).max(5).required()
  }).required()
});

module.exports = {
  [ACCOUNTS_CREATION_REQUESTED_BY_CLIENT]: ACCOUNTS_CREATION_REQUESTED_BY_CLIENT_VALIDATOR,
  [CREATE_ACCOUNTS]: CREATE_ACCOUNTS_VALIDATOR,
};
