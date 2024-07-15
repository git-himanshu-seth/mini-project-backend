const express = require("express");
const userApp = require("./userRoutes");

const userRoutes = express.Router();
userRoutes.use("/users", userApp);
module.exports = userRoutes;
