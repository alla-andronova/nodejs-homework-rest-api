const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(5).required(),
  phone: Joi.string().min(5).required(),
  favorite: Joi.boolean(),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { contactSchema, updateStatusSchema };
