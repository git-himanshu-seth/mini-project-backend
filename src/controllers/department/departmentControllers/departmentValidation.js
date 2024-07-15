const Joi = require("joi");
const { handleJoiErrorResponse } = require("../../../helpers/ResponseHandler");
const { USER_TYPE, DEVICE_TYPE } = require("../../../helpers/constants");

const validateCreateDepartmentData = (req, res, cb) => {
  const schema = Joi.object({
    department_name: Joi.string().min(4).max(12).required(),
    description: Joi.string().min(4).max(12).required(),
    department_code: Joi.string().required(),
    created_by: Joi.string().required(),
  });
  const { error, result } = schema.validate(req);

  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};

const validateUpdateDepartmentData = (req, res, cb) => {
  const schema = Joi.object({
    department_name: Joi.string().min(4).max(12).required(),
    description: Joi.string().min(4).max(12).required(),
    department_code: Joi.string().required(),
  });
  const { error, result } = schema.validate(req);

  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};
const validateDeleteDepartmentData = (req, res, cb) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, result } = schema.validate(req);

  if (error) return res.status(400).json(handleJoiErrorResponse(error.message));

  cb(true);
};

module.exports = {
  validateCreateDepartmentData,
  validateUpdateDepartmentData,
  validateDeleteDepartmentData,
};
