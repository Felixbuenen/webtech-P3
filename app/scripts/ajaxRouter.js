/**
 * ajaxRouter.js contains the routing logic for AJAX requests
 */

const express = require("express");
const router = express.Router();
const storePurchase = require("./database-store").storePurchase;
const updateUser = require("./database-store").updateUser;
const User = require("./database-store").User;
const Author = require("./database-store").Author;
const getMultipleAuthorData = require("./database-queries").getMultipleAuthorData;

router.post("/settings", (req, res) => {
  if (req.body.email === req.session.email) {
    res.send(JSON.stringify({ isValid: true }));
  } else {
    const db = require("./database-init");
    db.get(
      "SELECT * FROM Users WHERE email = ?", 
      [req.session.email],
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
          const oldEmail = req.session.email;

          updateUser(new User(fname, lname, email, pass), oldEmail);
        
          req.session.fname = fname;
          req.session.fname = lname;
          req.session.fname = email;
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
      [req.session.email],
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
  if (req.session) {
    if (req.session.fname) {
      res.send("already logged in");
      return;
    }
  }

  const email = req.body.email;
  const pass = req.body.password;

  //console.log(email + " " + pass);
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
        req.session = req.session;

        req.session.fname = row.firstName;
        req.session.lname = row.lastName;
        req.session.email = email;

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
  storePurchase(req.body.bookID, req.session.email);

  // succesful purchase
  res.sendStatus(200);
});


// DEBUG COMMENT: dit is waar de ajax request afgehandeld wordt. Hier wil je server side dingen regelen (zoals db queries)
router.post("/books", (req, res) => {
  
  let search = decodeURIComponent(req.body.search);
  let filter = req.body.filter;
  let pageIndex = req.body.index;
  let query;
  let params = [];

  const db = require("./database-init");
  query = "SELECT DISTINCT Books.rowid, Books.* FROM Books, Authors WHERE Books.title LIKE ? " +
          "OR ((Authors.firstName || ' ' || Authors.lastName) LIKE ? AND Authors.rowid = Books.authorID)"; 

  if(search == "null" || search == "") {
    params = ['%', '%'];
  }
  else {
    params = ['%' + search + '%', '%' + search + '%'];
  }

  let books = []; // books that will be sent to the client
  let authors = []; // authors (index corresponding to books indices) 
  let bookShowLimit = 10; // total number of books shown on page
  let bookIndex = (parseInt(pageIndex)-1) * bookShowLimit; // first book in DB which needs to be shown (based on page index) 

  let indexCounter = 0;
  let bookCounter = 0;

  // get all books
  db.each(query, params, (err, row) => {
      // only add books to the list that we want to show
      if(indexCounter == bookIndex && bookCounter < bookShowLimit) {
        books.push(row);
        bookCounter++;
      }
      else {
        indexCounter++;
      }
    }, 
    (err, rows) => {

      let authorIDs = [];
      books.forEach(book => {
        authorIDs.push(book.authorID);
      });

    // get all corresponding authors
    getMultipleAuthorData(authorIDs, (authors) => {
      // send book data back to the client
      res.send(JSON.stringify({
        nrBooks: rows,
        showBooks: books,
        showAuthors: authors
      }))
    });

  });


})

module.exports = router;
