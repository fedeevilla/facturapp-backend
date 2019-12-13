const Payment = require("../models/payment");
const mongoose = require("mongoose");

const isOwner = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).json({
      message: "Invalid ID."
    });
  }
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(422).json({
      message: "Could not find payment."
    });
  }

  if (payment.idUser !== req.user._id) {
    return res.status(422).json({
      message: "Access Denied"
    });
  }
  req.payment = payment;
  next();
};

module.exports = isOwner;
