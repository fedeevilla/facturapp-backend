const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Payment = require("../models/payment");

// GET All Payments
router.get("/", async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

// Add Payment
router.post("/", async (req, res) => {
  const { date, amount, dollar } = req.body;
  // if (!date || !amount) {
  //   return res.status(422).json({ message: "Validation failed." });
  // }

  const payment = new Payment({ date, amount, dollar });
  await payment.save();
  res.json(payment);
});

//Delete Payment
router.delete("/:id", async (req, res) => {
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

  await Payment.findByIdAndRemove(req.params.id);
  res.json({ status: "Payment Deleted" });
});

// GET By ID
// router.get("/:id", async (req, res) => {
//   const payment = await Payment.findById(req.params.id);
//   res.json(payment);
// });

// Edit Payment
// router.put("/:id", async (req, res) => {
//   const { date, amount, dollar } = req.body;
//   const newPayment = { date, amount, dollar };
//   await Payment.findByIdAndUpdate(req.params.id, newPayment);
//   res.json(newPayment);
// });

module.exports = router;
