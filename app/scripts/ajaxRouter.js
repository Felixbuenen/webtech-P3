/**
 * ajaxRouter.js contains the routing logic for AJAX requests
 */

const express = require("express");
const router = express.Router();
const storePurchase = require("./database-store").storePurchase;
const updateUser = require("./database-store").updateUser;
const User = require("./database-store").User;

router.post("/settings", (req, res) => {
  if (req.body.email === global.sess.email) {
    res.send(JSON.stringify({ isValid: true }));
  } else {
    const db = require("./database-init");
    db.get(
      "SELECT * FROM Users WHERE email = ?", 
      [req.body.email],
      (err, row) => {
        if (row) {
          res.send(JSON.stringify({ isValid: false }));
        } 
        
        // settings were successfully validated, update the user
        else {
          const fname = req.body.fname;
          const lname = req.body.lname;
          const pass = req.body.password;
          const email = req.body.email;
        
          updateUser(new User(fname, lname, email, pass));
        
          global.sess.fname = fname;
          global.sess.lname = lname;
          global.sess.email = email;
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
  let userPurchases = [];

  const db = require("./database-init");
  db.each(
    "SELECT Books.title, Books.image, Purchases.date " +
      "FROM Books, Purchases, Users " +
      "WHERE Users.email = ? " +
      "AND Purchases.userID = Users.rowid " +
      "AND Purchases.bookID = Books.rowid",
      [global.sess.email],
    (err, row) => {
      console.log(row);
      userPurchases.push(row);
    },
    (err, rows) => {
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
  db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
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

router.post("/purchase", (req, res) => {
  storePurchase(req.body.bookID);

  // succesful purchase
  res.sendStatus(200);
});


// DEBUG COMMENT: dit is waar de ajax request afgehandeld wordt. Hier wil je server side dingen regelen (zoals db queries)
router.post("/books", (req, res) => {
  
  let search = req.body.search;
  let pageIndex = req.body.index;
  let query;

  const db = require("./database-init");
  if(search == "null" || search == "") {
    query = "SELECT rowid, * FROM Books";
  }
  else {
  /**
   * DEBUG COMMENT:
   * De '?' wordt vervangen
    * door een parameter die je in de parameter lijst bij db.all(*query*, [search]) opgeeft (dit is goed tegen injectie).
    * De query is uiteraard nog niet goed, er moet namelijk ook gezocht kunnen worden op auteur. Voor nu kunnen we de zoekopdracht altijd
    * toepassen op boek titel en auteur, daarna kunnen we dit optioneel maken. Ook moet er nog gefilterd kunnen worden.
   */
    query = "SELECT rowid, * FROM Books WHERE title = ?", [search];
  }

  let books = []; // books that will be sent to the client
  let bookShowLimit = 10; // total number of books shown on page
  let bookIndex = (parseInt(pageIndex)-1) * bookShowLimit; // first book in DB which needs to be shown (based on page index) 

  let indexCounter = 0;
  let bookCounter = 0;

  db.each(query, (err, row) => {
    // only add books to the list that we want to show
    if(indexCounter == bookIndex && bookCounter <= bookShowLimit) {
      books.push(row);
      bookCounter++;
    }
    else {
      indexCounter++;
    }
  }, (err, rows) => {
    // send book data back to the client
    res.send(JSON.stringify({
      nrBooks: rows,
      showBooks: books
    }))
  })
})

module.exports = router;
