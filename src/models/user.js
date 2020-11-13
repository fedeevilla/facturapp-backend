const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, min: 6, max: 255 },
  email: { type: String, required: true, min: 6, max: 255 },
  password: { type: String, required: true, min: 6, max: 1024 },
  avatar: { type: String, default: null },
  isValid: { type: Boolean, default: false },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  usdBalance: { type: Number, default: 0 },
  usdBankUS: { type: Number, default: 0 },
  usdBankAR: { type: Number, default: 0 },
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Users", UserSchema);
