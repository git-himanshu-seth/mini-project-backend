const express = require("express");
const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartments,
  getDepartmentById,
} = require("../../controllers/department/departmentControllers");
const { userManagerAuthMiddleWare } = require("../../helpers/middleWares");

const departmetApp = express.Router();

departmetApp.use(userManagerAuthMiddleWare);

departmetApp.route("department").get(getDepartments).post(createDepartment);

departmetApp
  .route("department/:id")
  .get(getDepartmentById)
  .post(updateDepartment)
  .delete(deleteDepartment);

module.exports = departmetApp;
