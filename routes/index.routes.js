const express = require('express');
const router = express.Router();

// require (import) middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home/login page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

module.exports = router;
