const mongoose = require("mongoose");
const Joi = require("joi");

const ingredientSchema = new mongoose.Schema({
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
  expiry: {
    type: Date,
    required: true,
  },
  icon: {
    type: Boolean,
  },
  images: {
    type: Array,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

function validateIngredient(ingredient) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    quantity: Joi.string().min(1).required(),
    category: Joi.string().min(2).required(),
    address: Joi.string().min(2).required(),
    city: Joi.string().min(2).required(),
    phoneNumber: Joi.string().min(10).required(),
    expiry: Joi.date().required(),
    images: Joi.array(),
    userId: Joi.string().required(),
  });

  return schema.validate(ingredient);
}

exports.Ingredient = Ingredient;
exports.validate = validateIngredient;
