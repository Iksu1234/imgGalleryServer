const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
require("dotenv").config();

const allowedOrigin = process.env.URL;

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
router.use(checkOrigin);

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
// modify ratings to rating.json
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

module.exports = router;
