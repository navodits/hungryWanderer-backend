const { Message, validate } = require("../models/message");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.get("/", async (req, res) => {
  const message = await Message.find().sort("name");
  res.send(message);
});

router.get("/:id", async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(message);
});

router.post("/", (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  let message = new Message({
    name: req.body.name,
    text: req.body.text,
    phone: req.body.phone,
  });
});
router.put("/:id", (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  const message = Message.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, text: req.body.text, phone: req.body.phone },
    { new: true }
  );
  if (!message) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(message);
});

router.delete("/:id", (req, res) => {
  const message = Message.findByIdAndRemove(req.params.id);
  if (!message) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(message);
});

module.exports = router;
