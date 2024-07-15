const mongoose = require("mongoose");
const { USER_TYPE, DEVICE_TYPE } = require("../../helpers/constants");
const { Schema, model } = mongoose;
const user = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email_address: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  user_type: { type: Number, required: true, enum: [Object.values(USER_TYPE)] },
  device_type: {
    type: Number,
    required: true,
    enum: [Object.values(DEVICE_TYPE)],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

user.set("toObject", { virtuals: true });
user.set("toJSON", { virtuals: true });

user.index({ email_address: 1 });

const Users = model("Users", user);

module.exports = Users;
