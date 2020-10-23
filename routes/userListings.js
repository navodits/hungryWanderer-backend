const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Ingredient } = require("../models/ingredient");
const { Food } = require("../models/food");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  let ingredients = await Ingredient.find().sort("datePosted");

  let foods = await Food.find().sort("datePosted");

  ingredients = ingredients.filter(
    (ingredient) => ingredient.userId === req.user._id
  );
  //   if (ingredients.length === 0) {
  //     ingredients = {
  //       name: "NoPosts",
  //     };
  //   }
  //   if (foods.length === 0) {
  //     foods = {
  //       name: "NoPosts",
  //     };
  //   }

  foods = foods.filter((food) => food.userId === req.user._id);

  const userListings = { ingredients, foods };
  res.send(userListings);
});

module.exports = router;
