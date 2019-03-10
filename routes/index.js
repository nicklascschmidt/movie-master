const path = require("path");
const express = require("express");
const router = require("express").Router();
const apiRoutes = require("./api");

// API Routes
router.use("/api", apiRoutes);

// No middleware action needed - If no API routes are hit, send application
router.use((req, res, next) => {
  next();
});

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../','client','index.html'));
})
router.get('/my-movies', function(req, res) {
  res.sendFile(path.join(__dirname, '../','client','my-movies.html'));
});
router.get('/search', function(req, res) {
  res.sendFile(path.join(__dirname, '../','client','search.html'));
});

module.exports = router;
