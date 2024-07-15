const jwt = require("jsonwebtoken");
const { handleResponseWithoutData } = require("../helpers/ResponseHandler");
const { RESPONSE_TYPE, USER_TYPE } = require("../helpers/constants");

const userAuthMiddleWare = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS_KEY_USER,
      (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json(
              handleResponseWithoutData("InvalidToken", RESPONSE_TYPE.FAIL)
            );
        }
        req.user = decoded;
        next();
      }
    );
  } else {
    res
      .status(401)
      .json(handleResponseWithoutData("TokenNotProvided", RESPONSE_TYPE.FAIL));
  }
};

const userManagerAuthMiddleWare = (req, res, next) => {
  if (req?.headers?.authorization) {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS_KEY_USER,
        (err, decoded) => {
          if (err) {
            return res
              .status(403)
              .json(
                handleResponseWithoutData("InvalidToken", RESPONSE_TYPE.FAIL)
              );
          }
          if (decoded.user_type === "manager") {
            next();
          } else {
            return res
              .status(403)
              .json(
                handleResponseWithoutData("invalidUserType", RESPONSE_TYPE.FAIL)
              );
          }
        }
      );
    } else {
      res
        .status(401)
        .json(
          handleResponseWithoutData("TokenNotProvided", RESPONSE_TYPE.FAIL)
        );
    }
  } else {
    res
      .status(401)
      .json(handleResponseWithoutData("TokenNotProvided", RESPONSE_TYPE.FAIL));
  }
};
module.exports = {
  userAuthMiddleWare,
  userManagerAuthMiddleWare,
};
