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

module.exports = router;
