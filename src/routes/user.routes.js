const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  signupValidation,
  loginValidation
} = require("../validations/userValidations");
const isAuth = require("../middlewares/isAuth");
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
    const userDB = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    const user = await userDB.save();

    // ASSIGN TOKEN
    const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
      expiresIn: "24h"
    });
    res.json({
      user,
      token
    });
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
  const token = jwt.sign({ user }, process.env.SECRET_TOKEN);
  res.header("token", token).send({ user, token });
});

router.get("/fetch", isAuth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send({ message: "User does not exists" });

  res.send(user);
});

module.exports = router;
