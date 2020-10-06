const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
    minlength: 10,
    maxlength: 10,
  },
});

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    text: Joi.string().min(2).required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });

  return schema.validate(message);
}

exports.Message = Message;
exports.validate = validateMessage;
