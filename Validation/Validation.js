const joi = require("@hapi/joi");

const signup = (data) => {
  const schema = joi.object({
    fullname: joi.string().required(),
    location: joi.string().required(),
    salary: joi.string().required(),
    subject: joi.string().required(),
    phoneNumber: joi.string().required(),
    exprience: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(5),
  });
  return schema.validate(data);
};

module.exports.signup = signup;
