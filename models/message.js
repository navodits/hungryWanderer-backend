const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
  listingId: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    listiingId: Joi.string().min(2).required(),
    message: Joi.string().min(2).required(),
  });

  return schema.validate(message);
}

exports.Message = Message;
exports.validate = validateMessage;
