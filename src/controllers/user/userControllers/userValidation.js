const Joi = require("joi");
const { handleJoiErrorResponse } = require("../../../helpers/ResponseHandler");
const { USER_TYPE, DEVICE_TYPE } = require("../../../helpers/constants");

const validateUserData = (req, res, cb) => {
  const schema = Joi.object({
    first_name: Joi.string().min(4).max(12).required(),
    last_name: Joi.string().min(4).max(12).required(),
    email_address: Joi.string().email().required(),
    location: Joi.string().required(),
    user_type: Joi.number()
      .required()
      .valid(...Object.values(USER_TYPE)),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must be 8-30 characters long and can only contain letters and numbers.",
        "any.required": "Password is required.",
      }),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password must match the password.",
        "any.required": "Confirm password is required.",
      }),
  });
  const { error, result } = schema.validate(req);

  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};

const loginValidation = (req, res, cb) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  const { error, result } = schema.validate(req);
  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};

const getUserDetailsValidation = (req, res, cb) => {
  const schema = Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email_address: Joi.string().email().required(),
  });
  const { error, result } = schema.validate(req);
  if (error)
    return res
      .status(403)
      .json(handleResponseWithoutData("InvalidToken", RESPONSE_TYPE.FAIL));

  cb(true);
};

const validateUpdateUserData = (req, res, cb) => {
  const schema = Joi.object({
    first_name: Joi.string().min(4).max(12).required(),
    last_name: Joi.string().min(4).max(12).required(),
    age: Joi.number().min(18).max(70).required(),
    email_address: Joi.string().email().required(),
    user_type: Joi.number().required().valid(USER_TYPE),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    device_type: Joi.number()
      .required()
      .valid(...Object.keys(DEVICE_TYPE)),
  });
  const { error, result } = schema.validate(req);

  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};

module.exports = {
  validateUserData,
  loginValidation,
  getUserDetailsValidation,
  validateUpdateUserData,
};
