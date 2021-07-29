"use strict";

// load modules
const express = require("express");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { Course } = require("../models");
const { User } = require("../models");
const router = express.Router();

//TODO: Send a GET request to /courses route that will return all courses including the User associated with each course and a 200 HTTP status code.

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "userInfo",
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(courses);
  })
);

// * Send a GET request to /courses/:id route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "userInfo",
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course Not found" });
    }
  })
);

// * Send a POST request to /courses route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const courseBody = req.body;

      //* adds userId to req.body if the user is authenticated
      courseBody.userId = req.currentUser.id;

      const course = await Course.create(courseBody);
      res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (err) {
      console.log("Error ", err.name);

      // * checks the type of Sequelize error
      if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        // * if not a validation or unique constraint error throw an error thats caught by global err handler
        throw err;
      }
    }
  })
);

// * Send a PUT request to /courses/:id route that will update the corresponding course and return a 204 HTTP status code and no content.

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);

      if (course) {
        // checks if the course belongs to the current user
        if (req.currentUser.id === course.userId) {
          // * update the database
          await course.update(req.body);
          res.status(204).json({ message: "Course Updated" });
        } else {
          res
            .status(403)
            .json({ message: "You are not authorized to edit this coures" });
        }
      } else {
        res.status(404).json({ message: "Course Not found" });
      }
    } catch (err) {
      console.log("Error ", err.name);

      // * checks the type of Sequelize error
      if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        // * checks the type of Sequelize error
        throw err;
      }
    }
  })
);

// * Send a DELETE request to /course/:id route that will delete the corresponding course and return a 204 HTTP status code and no content.

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "You are not authorized to delete this coures" });
      }
    } else {
      res.status(404).json({ message: "Course Not found" });
    }
  })
);

// exports router
module.exports = router;
