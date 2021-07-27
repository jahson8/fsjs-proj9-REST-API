"use strict";

// load modules
const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { Course } = require("../models");
const router = express.Router();

//TODO: Send a GET request to /courses route that will return all courses including the User associated with each course and a 200 HTTP status code.

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(courses);
  })
);

// TODO: Send a GET request to /courses/:id route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course Not found" });
    }
  })
);

// TODO: Send a POST request to /courses route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location(`/courses/${course.id}`)
        .json({ message: "Course Created" });
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
        // * if not a validation or unique constraint error throw an error thats caught by global err handler
        throw err;
      }
    }
  })
);

// TODO: Send a PUT request to /courses/:id route that will update the corresponding course and return a 204 HTTP status code and no content.

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);

      if (course) {
        // * update the database
        await course.update(req.body);
        res.status(204).json({ message: "Course Updated" });
      } else {
        res.status(404).json({ message: "Course Not found" });
      }
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

// TODO: Send a DELETE request to /course/:id route that will delete the corresponding course and return a 204 HTTP status code and no content.

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Course Not found" });
    }
  })
);

// exports router
module.exports = router;
