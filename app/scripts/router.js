/**
 * This file contains the router logic for the main html requests.
 */

const express = require("express");
const router = express.Router();

// set EJS variables
router.use((req, res, next) => {
  let pageVars = {
    loggedIn: false,
    fname: "Account",
    lname: ""
  };

  // if user is logged in...
  if (global.sess) {
    pageVars.fname = global.sess.fname;
    pageVars.lname = global.sess.lname;
    pageVars.loggedIn = true;
  }

  req.pageVars = pageVars;

  next();
});

router.get("/", (req, res) => {
  res.render("pages/index", req.pageVars);
});
router.get("/books.html", (req, res) => {
  res.render("pages/books", req.pageVars);
});
router.get("/info.html", (req, res) => {
  res.render("pages/info", req.pageVars);
});
router.get("/register.html", (req, res) => {
  let errMsg = "";
  if (req.query.error == "0")
    errMsg = "You need to specify an e-mail and password";
  else if (req.query.error == "1") errMsg = "An error occured";
  else if (req.query.error == "2") errMsg = "E-mail already exists";

  req.pageVars.errorMessage = errMsg;
  errMsg = errMsg = res.render("pages/register", req.pageVars);
});
router.get("/debugLogin.html", (req, res) => {
  res.render("pages/debugLogin", req.pageVars);
});

module.exports = router;
