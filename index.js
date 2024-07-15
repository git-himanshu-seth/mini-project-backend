const express = require("express");
const mongoose = require("mongoose");
const { userRoutes, departmentRoutes } = require("./src/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var morgan = require("morgan");
require("dotenv").config();

let logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

app.disable("x-powered-by");
app.use(bodyParser.json());
var whitelist = ["http://localhost:5173"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/miniProject", {
    serverSelectionTimeoutMS: 5000,
  })
  .then((connection) =>
    console.log("Connected! to db", connection.connection.db.s.namespace.db)
  )
  .catch((err) => {
    console.log("err:", err);
  });
app.use(logger);

app.use("/mini-project/api/v1", [userRoutes, departmentRoutes]);

app.listen(process.env.PORT, () => {
  console.log("app is running port :", process.env.PORT);
});
