const express = require("express");
const { Food, validate } = require("../models/food");
const upload = require("../middleware/imageUpload");
const { HttpResponse } = require("aws-sdk");
const router = express.Router();

router.get("/", async (req, res) => {
  const foods = await Food.find().sort("datePosted");
  res.send(foods);
});

router.get("/:id", async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(food);
});

router.post("/", upload, async (req, res) => {
  const imageUris = [];
  const datePosted = Date.now();
  const files = await req.files;

  files.forEach((file) => {
    imageUris.push(file.location);
  });

  const result = validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  let food = new Food({
    name: req.body.name,
    quantity: req.body.quantity,
    address: req.body.address,
    city: req.body.city,
    expiry: req.body.expiry,
    userId: req.body.userId,
    phoneNumber: req.body.phoneNumber,
    datePosted,
    imageUris,
  });

  food = await food.save();
  res.send("Success");
});

router.put("/:id", upload, async (req, res) => {
  const imageUris = [];
  const result = validate(req.body);
  const datePosted = Date.now();
  const files = await req.files;
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }

  files.forEach((file) => {
    imageUris.push(file.location);
  });

  const food = await Food.findOneAndReplace(
    req.params.id,
    {
      name: req.body.name,
      quantity: req.body.quantity,
      address: req.body.address,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
      bestBefore: req.body.bestBefore,
      userId: req.body.userId,
      datePosted,
      imageUris,
    },
    { new: true }
  );

  if (!food) {
    res.status(404).send("The item with given ID was not found");
    return;
  }
  res.send(food);
});

router.delete("/:id", async (req, res) => {
  const food = await Food.findByIdAndRemove(req.params.id);
  if (!food) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(food);
});

module.exports = router;
