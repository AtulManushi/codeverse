const mongoose = require("mongoose");
const { Timestamp } = require("firebase-admin/firestore");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    deviceToken: { type: String, require: true },
    online: { type: Boolean, default: false },
  },
  { Timestamp: true }
);


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
