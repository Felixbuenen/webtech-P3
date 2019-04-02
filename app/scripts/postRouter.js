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

    global.sess = req.session;

    global.sess.fname = fname;
    global.sess.lname = lname;
    global.sess.email = email;

    storeUser(new User(fname, lname, email, pass));

    res.redirect("/");
    res.end();
  });
});

router.post("/login", (req, res) => {
  if (global.sess) {
    if (global.sess.fname) {
      res.send("already logged in");
      return;
    }
  }

  const email = req.body.email;
  const pass = req.body.password;
  let success = false;
  global.sess = req.session;

  const db = require("./database-init");
  db.get("SELECT * FROM Users WHERE email='" + email + "'", (err, row) => {
    if (err != undefined) {
      console.log(err);
      res.send("an error occured");
      return;
    }

    if (row) {
      if (row.password == pass) {
        global.sess.fname = row.firstName;
        global.sess.lname = row.lastName;
        global.sess.email = email;

        success = true;
      }

      if (success === false) {
        console.log(
          "wrong pass word '" + pass + "' (should be '" + row.password + "'"
        );
        res.redirect("debugLogin.html");
      } else {
        res.redirect("/");
      }

      res.end();
    } else {
      console.log("row not found");
      res.redirect("debugLogin.html");
    }
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  global.sess = undefined;

  res.redirect("/");
});

router.post("/update-settings", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;

  updateUser(new User(fname, lname, email, pass));

  global.sess.fname = fname;
  global.sess.lname = lname;
  global.sess.email = email;

  res.redirect("/");
});

module.exports = router;
