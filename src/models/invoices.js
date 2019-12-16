const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  idUser: { type: String, required: true },
  date: { type: Number, required: true },
  amount: { type: Number, required: true },
  dollar: { type: Number, default: 0 },
  pdf: { type: String }
});

InvoiceSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Invoices", InvoiceSchema);
