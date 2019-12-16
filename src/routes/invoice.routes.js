const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Invoice = require("../models/invoice");
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");
const {
  createInvoiceValidation
} = require("../validations/invoiceValidations");

// GET All User Invoices
router.get("/", isAuth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ idUser: req.user._id });
    res.json(invoices);
  } catch (err) {
    res.status(400).send(err);
  }
});

//GET By ID
router.get("/:id", isAuth, isOwner, async (req, res) => {
  try {
    return res.json(req.invoice);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add Invoice
router.post("/", isAuth, async (req, res) => {
  // VALIDATIONS
  const { error } = createInvoiceValidation(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const invoice = new Invoice({ ...req.body, idUser: req.user._id });
  await invoice.save();
  res.json(invoice);
});

//Delete Invoice
router.delete("/:id", isAuth, isOwner, async (req, res) => {
  try {
    req.invoice.remove();
    res.json({ status: "Invoice Deleted." });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Edit Invoice
router.put("/:id", isAuth, isOwner, async (req, res) => {
  try {
    await Invoice.findByIdAndUpdate(req.invoice._id, req.body);

    res.json({ _id: req.invoice._id, ...req.body });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
