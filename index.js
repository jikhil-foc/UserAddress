const express = require("express");

const app = express();
require("dotenv").config();

const userRoutes = require("./routes/users.routes");

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const db = require("./models");

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json("Welcome to UserManagement");
});

const port = 3000;

db.sequelize
  .sync()
  .then((result) => {
    app.listen(port, () => console.log("Server started ! Port Number" + port));
  })
  .catch((err) => {
    console.log(err);
  });
