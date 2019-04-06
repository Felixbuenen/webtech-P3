/**
 * ajaxRouter.js contains the routing logic for AJAX requests
 */

const express = require("express");
const router = express.Router();

router.post("/emailExists", (req, res) => {

  console.log(req.body.email);

  if (req.body.email === global.sess.email) {
    res.send(JSON.stringify({ isValid: true }));
  } else {
    const db = require("./database-init");
    db.get(
      "SELECT * FROM Users WHERE email='" + req.body.email + "'",
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

class PurchaseInfo {
  constructor(bookTitle, purchaseDate, bookImage) {
    this.bookTitle = bookTitle;
    this.purchaseDate = purchaseDate;
    this.bookImage = bookImage;
  }
}

router.post("/profileData", (req, res) => {
  console.log(req.body);
  //res.send(JSON.stringify({data: req.body.data}));

  let userPurchases = [];

  const db = require("./database-init");
  db.each(
    "SELECT Books.title, Books.image, Purchases.date " +
      "FROM Books, Purchases, Users " +
      "WHERE Users.email = " + "'" + global.sess.email + "' " +
      "AND Purchases.userID = Users.rowid " +
      "AND Purchases.bookID = Books.rowid",
    (err, row) => {
      console.log(row);
      userPurchases.push(row);
    },
    (err, rows) => {
      userPurchases.forEach(element => {
        console.log(element);
      });

      res.send(
        JSON.stringify({
          nrItems: rows,
          books: userPurchases
        })
      );
      
      res.end();
    }
  );
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

  console.log(email + " " + pass);
  let success = false;

  const db = require("./database-init");
  db.get("SELECT * FROM Users WHERE email='" + email + "'", (err, row) => {
    if (err != undefined) {
      console.log(err);
      res.send(JSON.stringify({errorMsg: "An error occured. Please try again later."}));
      return;
    }

    if (row) {
      if (row.password == pass) {
        global.sess = req.session;

        global.sess.fname = row.firstName;
        global.sess.lname = row.lastName;
        global.sess.email = email;

        success = true;
      }

      if (success === false) {
        console.log(
          "wrong pass word '" + pass + "' (should be '" + row.password + "')"
        );
        res.send(JSON.stringify({errorMsg: "The e-mail or password could not be found."}));
      } else {        
        res.send(JSON.stringify({errorMsg: ""}));
      }

      res.end();
    } else {
      console.log("row not found");
      res.send(JSON.stringify({errorMsg: "The e-mail or password could not be found."}));
    }
  });
});

module.exports = router;
