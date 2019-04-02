/**
 * registerRouter.js contains the routing logic for logging in and registration.
 */

const express = require("express");
const router = express.Router();

router.post("/emailExists", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.query.email === global.sess.email) {
    res.send(JSON.stringify({ isValid: true }));
  } else {
    const db = require("./database-init");
    db.get(
      "SELECT * FROM Users WHERE email='" + req.query.email + "'",
      (err, row) => {
        if (row) {
          res.send(JSON.stringify({ isValid: false }));
        } else {
          res.send(JSON.stringify({ isValid: true }));
        }
      }
    );
  }
});

module.exports = router;
