const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const departmentSchema = new Schema({
  department_name: { type: String, required: true },
  description: { type: String, required: true },
  department_code: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
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

departmentSchema.set("toObject", { virtuals: true });
departmentSchema.set("toJSON", { virtuals: true });

departmentSchema.index({ department_code: 1 });

const Department = model("Department", departmentSchema);

module.exports = Department;
