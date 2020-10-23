const { Ingredient, validate } = require("../models/ingredient");
const express = require("express");
const upload = require("../middleware/imageUpload");
const router = express.Router();

router.get("/", async (req, res) => {
  const ingredients = await Ingredient.find().sort("datePosted");
  res.send(ingredients);
});

router.get("/:id", async (req, res) => {
  const ingredient = await Ingredient.findById(req.params.id);

  if (!ingredient) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(ingredient);
});

router.post("/", upload, async (req, res) => {
  let icon = true;
  let images = [];
  let datePosted = Date.now();

  const files = await req.files;

  let result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  if (files.length == 0) {
    icon = false;
  } else {
    files.forEach((file) => {
      images.push(file.location);
    });
  }

  let ingredient = new Ingredient({
    name: req.body.name,
    quantity: req.body.quantity,
    category: req.body.category,
    address: req.body.address,
    city: req.body.city,
    expiry: req.body.expiry,
    userId: req.body.userId,
    datePosted,
    images,
    icon,
  });

  ingredient = await ingredient.save();
  console.log(ingredient);
  res.send("Success");
});

router.put("/:id", async (req, res) => {
  const icon = true;
  const imageUris = [];
  const result = validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  if (req.files.length == 0) {
    icon = false;
  } else {
    const files = req.files;

    files.forEach((file) => {
      imageUris.push(file.location);
    });
  }
  const ingredient = await Ingredient.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      quantity: req.body.quantity,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      bestBefore: req.body.bestBefore,
      datePosted,
      icon,
      imageUris,
    },
    { new: true }
  );

  if (!ingredient) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(ingredient);
});

router.delete("/:id", async (req, res) => {
  const ingredient = await Ingredient.findByIdAndRemove(req.params.id);
  if (!ingredient) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(ingredient);
});

module.exports = router;
