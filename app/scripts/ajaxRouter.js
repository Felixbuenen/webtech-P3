/**
 * ajaxRouter.js contains the routing logic for AJAX requests
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

router.post("/profileData", (req, res) => {
  console.log(req.body);
  //res.send(JSON.stringify({data: req.body.data}));
  res.send(JSON.stringify( {
    title: "AJAX TITLE",
    date: "3 April 2016"
  }));
  res.end();
})

module.exports = router;
