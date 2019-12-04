const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { signupValidation, loginValidation } = require("../validations");
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  // VALIDATIONS
  const { error } = signupValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({ message: "Email already exists" });

  // HASH PASSWORD
  const salt = await brcrypt.genSalt(10);
  const hashedPassword = await brcrypt.hash(req.body.password, salt);

  // CREATE USER
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // VALIDATIONS
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "User or password incorrect" });

  const validPassword = await brcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "User or password incorrect" });

  // ASSIGN TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  res
    .header("token", token)
    .send({ token, _id: user._id, email: user.email, name: user.name });
});

module.exports = router;
