const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, min: 6, max: 255 },
  email: { type: String, required: true, min: 6, max: 255 },
  password: { type: String, required: true, min: 6, max: 1024 },
  createdAt: { type: Number, default: new Date().getTime() }
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Users", UserSchema);
