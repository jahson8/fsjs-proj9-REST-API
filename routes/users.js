"use strict";

// load modules
const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { User } = require("../models");

const router = express.Router();

//TODO: Send a GET request to /users that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    res.json(users);
  })
);

//TODO: Send a POST request to /users that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (err) {
      console.log("Error ", err.name);

      // * checks the type of Sequelize error
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        // * checks the type of Sequelize error
        throw err;
      }
    }
  })
);

// exports router
module.exports = router;
