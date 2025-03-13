const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const checkUserPw = require("../services/userManagementService.js");
require("dotenv").config();

const allowedOrigin = process.env.URL;
const allowedPW = process.env.PASSWORD;

// Middleware to check the origin of incoming requests
const checkOrigin = (req, res, next) => {
  const origin = req.get("Origin");
  if (origin === allowedOrigin) {
    next();
  } else {
    res.status(403).send("Forbidden: Origin not allowed");
  }
};

// Apply the origin check middleware to all routes
//router.use(checkOrigin);

// GET ratings from rating.json
router.get("/ratings", (req, res) => {
  const filePath = path.join(__dirname, "../rating.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading rating.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const ratings = JSON.parse(data);
    res.json(ratings);
  });
});

// PATCH ratings to rating.json
router.patch("/ratings", (req, res) => {
  const filePath = path.join(__dirname, "../rating.json");
  const newRate = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading rating.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    let oldRate = JSON.parse(data);

    for (let i = 0; i < oldRate.length; i++) {
      oldRate[i].push(newRate[i]);
    }

    fs.writeFile(filePath, JSON.stringify(oldRate), "utf8", (err) => {
      if (err) {
        console.error("Error writing file", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send("Rating added successfully");
    });
  });
});

// DELETE ratings from rating.json
router.delete("/ratings", (req, res) => {
  const filePath = path.join(__dirname, "../rating.json");
  fs.writeFile(filePath, "[[], [], []]", "utf8", (err) => {
    if (err) {
      console.error("Error writing file", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).send("Deleted successfully");
  });
});

// GET images from images.json
router.get("/images", (req, res) => {
  console.log("GET /images");
  const filePath = path.join(__dirname, "../assets/images.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading images.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const images = JSON.parse(data);
    res.json(images);
  });
});

// POST check login password
router.post("/login", async (req, res) => {
  const { user, password } = req.body;
  const result = await checkUserPw(user, password);
  if (result === true) {
    res.status(200).send("Login successful");
  } else {
    res.status(401).send("Unauthorized");
  }
});

module.exports = router;
