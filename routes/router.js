const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const {
  checkUserPw,
  checkUserRole,
} = require("../services/userManagementService.js");
const { join } = require("path/posix");
const { Console } = require("console");
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

// PATCH images to images.json
router.patch("/images", (req, res) => {
  const filePath = path.join(__dirname, "../assets/images.json");
  const newImages = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading images.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    let oldImages = JSON.parse(data);
    try {
      oldImages.images.push(newImages);
    } catch (error) {
      console.log("Error patching images ", error);
    }
    fs.writeFile(filePath, JSON.stringify(oldImages), "utf8", (err) => {
      if (err) {
        console.error("Error writing file", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send("Images added successfully");
    });
  });
});

// DELETE selected images from images.json
router.delete("/images", (req, res) => {
  const filePath = path.join(__dirname, "../assets/images.json");
  const imagesToDelete = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading images.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    let oldImages = JSON.parse(data);

    imagesToDelete.sort(function (a, b) {
      return b - a;
    });
    try {
      for (let i = oldImages.images.length; i >= 0; i--) {
        for (let j = imagesToDelete.length; j >= 0; j--) {
          if (i === imagesToDelete[j]) {
            oldImages.images.splice(i, 1);
            console.log("Deleted image index: " + i);
          }
        }
      }
    } catch (error) {
      Console.log("Error deleting images ", error);
    }

    fs.writeFile(filePath, JSON.stringify(oldImages), "utf8", (err) => {
      if (err) {
        console.error("Error writing file", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send("Images deleted successfully");
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
  const result = checkUserPw(user, password);
  if (result === true) {
    if (checkUserRole(user) === true) {
      console.log("Login admin: " + user);
      res.status(200).send(true);
      return;
    } else {
      console.log("Login user: " + user);
      res.status(200).send(false);
      return;
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});

module.exports = router;
