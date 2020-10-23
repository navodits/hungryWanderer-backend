const { Message, validate } = require("../models/message");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req, res) => {
  const messages = await Message.find();

  messages = messages.filter((message) => message.userId === req.body.userId);

  const mapUser = (userId) => {
    const user = User.findById(userId);
    return { _id: user._id, name: user.name };
  };

  const resources = messages.map((message) => ({
    id: message.id,
    listingId: message.listingId,
    dateTime: message.dateTime,
    content: message.content,
    fromUser: mapUser(message.fromUserId),
    toUser: mapUser(message.toUserId),
  }));

  res.send(resources);
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

router.delete("/:id", (req, res) => {
  const message = Message.findByIdAndRemove(req.params.id);
  if (!message) {
    res.status(404).send("The item with given ID was not found");
    return;
  }

  res.send(message);
});

module.exports = router;
