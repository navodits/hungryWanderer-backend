const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    minlength: 3,
    maxlength: 1024,
    require: true,
  },
  pushToken: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    pushToken: Joi.string(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
