const express = require("express");
const {
  userManagerAuthMiddleWare,
  userAuthMiddleWare,
} = require("../../helpers/middleWares");
const {
  registerUser,
  userLogin,
  getEmployees,
  getUserDetails,
  assignDepartmentToEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../../controllers/user/userControllers");

const userApp = express.Router();

userApp.route("/login").post(userLogin);
userApp.route("/register").post(registerUser);
userApp.route("/employee").get([userAuthMiddleWare, getEmployees]);
userApp
  .route("/employee/:id")
  .post([userManagerAuthMiddleWare, updateEmployee])
  .delete([userManagerAuthMiddleWare, deleteEmployee])
  .get([userAuthMiddleWare, getUserDetails]);
userApp
  .route("/employee/add-edit-department")
  .post([userManagerAuthMiddleWare, assignDepartmentToEmployee]);

module.exports = userApp;
