const Joi = require('@hapi/joi');

module.exports = Joi.object({
  id: Joi.string().guid().required(),
  initiatedAt: Joi.date().timestamp().required()
});
