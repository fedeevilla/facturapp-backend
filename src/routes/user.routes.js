const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Hogan = require("hogan.js");
const fs = require("fs");

const {
  signupValidation,
  loginValidation
} = require("../validations/userValidations");
const isAuth = require("../middlewares/isAuth");
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const R = require("ramda");

router.post("/signup", async (req, res) => {
  // VALIDATIONS
  const { error } = signupValidation(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const template = fs.readFileSync(
      __dirname + "/views/templateEmailValidation.hjs",
      "utf-8"
    );

    const compiledTemplate = Hogan.compile(template);

    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Validación de cuenta",
      html: compiledTemplate.render({
        name: user.name,
        token,
        url: process.env.FACTURAPP_URL
      })
    });

    res.send({ message: "Account created successfully" });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // VALIDATIONS
  const { error } = loginValidation(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "User or password incorrect" });

  const validPassword = await brcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).send({ message: "User or password incorrect" });

  if (!user.isValid)
    return res.status(401).send({ message: "User does not validate" });

  // ASSIGN TOKEN
  const token = jwt.sign({ user }, process.env.SECRET_TOKEN);
  res.header("token", token).send({ user, token });
});

router.put("/validate/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) return res.status(401).send("Access Denied");

  try {
    const { user } = jwt.verify(token, process.env.SECRET_TOKEN);
    const validUser = await User.findById({ _id: user._id });
    validUser.isValid = true;

    await validUser.save();

    res.send({ user: validUser, token });
  } catch (err) {
    res.status(422).send("Invalid Token");
  }
});

router.put("/recover", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send({ message: "User doest not found" });

    // ASSIGN TOKEN
    const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
      expiresIn: "24h"
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const template = fs.readFileSync(
      __dirname + "/views/templatePasswordRecovery.hjs",
      "utf-8"
    );

    const compiledTemplate = Hogan.compile(template);

    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Recuperar contraseña",
      html: compiledTemplate.render({
        name: user.name,
        token,
        url: process.env.FACTURAPP_URL
      })
    });

    res.send({ message: "Email sended" });
  } catch (err) {
    res.status(422).send(err);
  }
});

router.put("/recover/:token", async (req, res) => {
  try {
    const password = req.body.password;
    const token = req.params.token;

    if (!token) return res.status(401).send("Access Denied");

    const { user } = jwt.verify(token, process.env.SECRET_TOKEN);

    if (!user) {
      res.status(422).send("Invalid Token");
    }
    const recoverUser = await User.findById({ _id: user._id });

    // HASH PASSWORD
    const salt = await brcrypt.genSalt(10);
    const hashedPassword = await brcrypt.hash(password, salt);

    recoverUser.password = hashedPassword;
    recoverUser.isValid = true;

    await recoverUser.save();

    res.send({ message: "Password reset successfully" });
  } catch (err) {
    res.status(422).send(err);
  }
});

router.get("/fetch", isAuth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send({ message: "User does not exists" });

  res.send(user);
});

router.patch("/profile", isAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user)
      return res.status(400).send({
        message: "User does not exists"
      });

    //Email Validation
    if (req.body.email) {
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist && emailExist._id != req.user._id)
        return res.status(400).send({ message: "Email already exists" });
    }

    let query = { $set: {} };
    for (let key in req.body) {
      if (R.propOr(true, user[key]) && user[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      }
    }

    await User.updateOne({ _id: req.user._id }, query);
    const updatedUser = await User.findOne({ _id: req.user._id });

    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/reset", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const compare = await brcrypt.compare(req.body.oldPassword, user.password);

    if (!compare) {
      return res.status(400).send({
        message: "Wrong password"
      });
    }

    // HASH PASSWORD
    const salt = await brcrypt.genSalt(10);
    const hashedPassword = await brcrypt.hash(req.body.newPassword, salt);

    await user.save({ password: hashedPassword });

    res.json({ message: "Password changed." });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
