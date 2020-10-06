const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  const token = user.generateAuthToken();

  res.send(token);

  user = await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
