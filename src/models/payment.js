const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    date: { type: Number, required: true },
    amount: { type: Number, required: true },
    dollar: { type: Number, default: 0 }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Payments", PaymentSchema);
