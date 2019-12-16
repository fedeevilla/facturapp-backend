const Joi = require("@hapi/joi");

const createValidation = data => {
  const schema = Joi.object({
    date: Joi.number().required(),
    amount: Joi.number().required(),
    dollar: Joi.number(),
    pdf: Joi.string()
  });

  return schema.validate(data);
};

module.exports.createPaymentValidation = createValidation;
