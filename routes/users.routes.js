const express = require("express");

const {
  getAllUsers,
  addUser,
  getUserDetailWithId,
} = require("../services/users.service");

const router = express.Router();

router.post("/", addUser);

router.get("/", getAllUsers);

router.get("/:id", getUserDetailWithId);

module.exports = router;
