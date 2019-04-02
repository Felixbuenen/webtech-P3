/**
 * This file contains the router logic for the main html requests.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/index");
});
router.get("/books.html", (req, res) => {
  res.render("pages/books");
});
router.get("/info.html", (req, res) => {
  res.render("pages/info");
});
router.get("/register.html", (req, res) => {
  let errMsg = "";
  if (req.query.error == "0")
    errMsg = "You need to specify an e-mail and password";
  else if (req.query.error == "1") errMsg = "An error occured";
  else if (req.query.error == "2") errMsg = "E-mail already exists";

  errMsg = errMsg = res.render("pages/register", { errorMessage: errMsg });
});
router.get("/debugLogin.html", (req, res) => {
  res.render("pages/debugLogin");
});

module.exports = router;
