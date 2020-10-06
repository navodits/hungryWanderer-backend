const mongoose = require("mongoose");
const Joi = require("joi");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  quantity: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  datePosted: {
    type: Date,
    required: true,
  },
  bestBefore: {
    type: Date,
    required: true,
  },
  imageUris: {
    type: Array,
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);

function validateFood(food) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    quantity: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
    address: Joi.string().min(2).required(),
    city: Joi.string().min(2).required(),
    datePosted: Joi.date().required(),
    bestBefore: Joi.date().required(),
    imageUris: Joi.array().required(),
  });

  return schema.validate(food);
}

exports.Food = Food;
exports.validate = validateFood;
