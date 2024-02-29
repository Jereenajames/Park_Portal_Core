const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  RoleName: {
    type: String,
    require: true,
  },
  RoleCode: {
    type: String,
    unique: true,
  },
  Description: {
    type: String,
    require: true,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  CreatedBy: {
    type: Number,
    require: true,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  UpdatedBy: {
    type: Number,
  },
  UpdatedDate: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model("userrole", roleSchema);
