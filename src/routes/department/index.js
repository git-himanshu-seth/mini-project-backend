const express = require("express");
const departmentApp = require("./department");

const departmentRoutes = express.Router();
departmentRoutes.use("/", [departmentApp]);
module.exports = departmentRoutes;
