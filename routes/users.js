"use strict";

// load modules
const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { User } = require("../models");

const router = express.Router();

//TODO: Send a GET request to /users/:id that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    let users = await User.findAll();
    res.json(users);
  })
);

//TODO: Send a POST request to /users that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.

// exports router
module.exports = router;
