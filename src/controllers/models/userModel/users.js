const mongoose = require("mongoose");
const { USER_TYPE, DEVICE_TYPE } = require("../../../helpers/constants");
const { Schema, model } = mongoose;
const user = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email_address: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
    enum: [...Object.values(USER_TYPE)],
  },
  location: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null,
  },
  department_assigne_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deleteAt: { type: Date, default: null },
});

user.set("toObject", { virtuals: true });
user.set("toJSON", { virtuals: true });

user.index({ email_address: 1 });

const Users = model("Users", user);

module.exports = Users;
