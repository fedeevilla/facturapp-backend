const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  idUser: { type: String, required: true },
  date: { type: Number, required: true },
  amount: { type: Number, required: true },
  dollar: { type: Number, default: 0 },
  pdf: { type: String }
});

PaymentSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Payments", PaymentSchema);
