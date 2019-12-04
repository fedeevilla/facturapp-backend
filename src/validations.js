const Joi = require("@hapi/joi");

const signupValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(6)
      .max(255),
    email: Joi.string()
      .required()
      .min(6)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
  });

  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .min(6)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
  });

  return schema.validate(data);
};

const fetchValidation = data => {
  const schema = Joi.object({
    idUser: Joi.string().required()
  });

  return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
module.exports.fetchValidation = fetchValidation;
