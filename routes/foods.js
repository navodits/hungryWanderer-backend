const express = require("express");
const { Food, validate } = require("../models/food");
const upload = require("../middleware/imageUpload");
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
  console.log(food);
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

  const food = await Food.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      quantity: req.body.quantity,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      datePosted: req.body.datePosted,
      bestBefore: req.body.bestBefore,
      imageUris,
    },
    { new: true }
  );

  if (!food) {
    res.status(404).send("The item with given ID was not found");
    return;
  }
  res.send(imageUris);
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
