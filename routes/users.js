const _ = require("lodash");
const auth = require("./../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.header.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User Already Exists.");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPW = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPW,
  });

  user = await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
