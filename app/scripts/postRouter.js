/**
 * registerRouter.js contains the routing logic for logging in and registration.
 */

const express = require("express");
const router = express.Router();
const { storeUser, updateUser, User } = require("./database-store");

router.post("/register", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;

  // no input
  if (!email || !pass) {
    res.redirect("./register.html?error=" + 0);
    return;
  }

  const db = require("./database-init");
  db.get("SELECT * FROM Users WHERE email='" + email + "'", (err, row) => {
    if (err != undefined) {
      res.redirect("./register.html?error=" + 1);
      return;
    }

    // email exists --> redirect user to register page
    if (row) {
      res.redirect("./register.html?error=" + 2);
      return;
    }

    req.session.fname = fname;
    req.session.lname = lname;
    req.session.email = email;

    storeUser(new User(fname, lname, email, pass));

    res.redirect("/");
    res.end();
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("back");
});

router.post("/update-settings", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;

  updateUser(new User(fname, lname, email, pass));

  req.session.fname = fname;
  req.session.lname = lname;
  req.session.email = email;

  res.redirect("/");
});

module.exports = router;
