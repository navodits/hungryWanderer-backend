const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const express = require("express");
const foods = require("./routes/foods");
const ingredients = require("./routes/ingredients");
const messages = require("./routes/messages");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();

// if (!config.get("jwtPrivateKey")) {
//   console.error("FATAL ERROR: jwtPrivateKey is not defined. ");
//   process.exit(1);
// }

mongoose
  .connect("mongodb://localhost/hungryWanderer")
  .then(() => console.log("Connnected to MongoDB..."))
  .catch((err) => console.error("Counld not connect to MongoDB..."));

app.use(express.json());
app.use("/api/foods", foods);
app.use("/api/ingredients", ingredients);
app.use("/api/messages", messages);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || config.get("port");

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
