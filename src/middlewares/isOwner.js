const Invoice = require("../models/invoice");
const mongoose = require("mongoose");

const isOwner = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).json({
      message: "Invalid ID."
    });
  }
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(422).json({
      message: "Could not find invoice."
    });
  }

  if (invoice.idUser !== req.user._id) {
    return res.status(401).json({
      message: "Access Denied"
    });
  }
  req.invoice = invoice;
  next();
};

module.exports = isOwner;
