const { Ingredient, validate } = require("../models/ingredient");
const express = require("express");
const upload = require("../middleware/imageUpload");
const router = express.Router();

const data = [
  {
    id: 1,
    name: "Milk",
    category: "dairy",
    quantity: "2L",
    address: "11234 66 Avenue",
    city: "Surrey",

    icon: false,
  },
  {
    id: 2,
    name: "Cottage Cheese",
    category: "dairy",
    quantity: "200g",
    address: "234 Columbia St",
    city: "New West",

    icon: true,
  },
  {
    id: 3,
    name: "Tomatoes",
    category: "produce",
    quantity: "5 pieces",
    address: "2433 Fraser St",
    city: "Vancouver",
    icon: false,
  },
  {
    id: 4,
    name: "Cilantro",
    category: "produce",
    quantity: "1 bunch",
    address: "2433 Fraser St",
    city: "Vancouver",
    icon: true,
  },
];

router.get("/", async (req, res) => {
  const ingredients = await Ingredient.find().sort("name");
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
