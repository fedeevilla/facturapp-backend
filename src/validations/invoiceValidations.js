const Joi = require("@hapi/joi");

const createValidation = data => {
  const schema = Joi.object({
    date: Joi.number().required(),
    amount: Joi.number().required(),
    pdf: Joi.string(),
    type: Joi.string(),
    provider: Joi.string(),
    dollar: Joi.number()
  });

  return schema.validate(data);
};

module.exports.createInvoiceValidation = createValidation;
