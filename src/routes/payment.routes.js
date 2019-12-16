const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Payment = require("../models/payment");
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");
const {
  createPaymentValidation
} = require("../validations/paymentValidations");

// GET All User Payments
router.get("/", isAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ idUser: req.user._id });
    res.json(payments);
  } catch (err) {
    res.status(400).send(err);
  }
});

//GET By ID
router.get("/:id", isAuth, isOwner, async (req, res) => {
  try {
    return res.json(req.payment);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add Payment
router.post("/", isAuth, async (req, res) => {
  // VALIDATIONS
  const { error } = createPaymentValidation(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const payment = new Payment({ ...req.body, idUser: req.user._id });
  await payment.save();
  res.json(payment);
});

//Delete Payment
router.delete("/:id", isAuth, isOwner, async (req, res) => {
  try {
    req.payment.remove();
    res.json({ status: "Payment Deleted." });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Edit Payment
router.put("/:id", isAuth, isOwner, async (req, res) => {
  try {
    await Payment.findByIdAndUpdate(req.payment._id, req.body);

    res.json({ _id: req.payment._id, ...req.body });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
