/**
 * ajaxRouter.js contains the routing logic for AJAX requests
 */

const express = require("express");
const router = express.Router();
const storePurchase = require("./database-store").storePurchase;
const updateUser = require("./database-store").updateUser;
const storeReview = require("./database-store").storeReview;
const User = require("./database-store").User;
const Author = require("./database-store").Author;
const Review = require("./database-store").Review;
const getMultipleAuthorData = require("./database-queries").getMultipleAuthorData;

router.post("/settings", (req, res) => {
  if (req.body.email === req.session.email) {
    res.send(JSON.stringify({ isValid: true }));
  } else {
    const db = require("./database-init");
    db.get(
      "SELECT * FROM Users WHERE email = ?", 
      [req.body.email],
      (err, row) => {
        if (row) {
          console.log(row.email);
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



router.post("/books", (req, res) => {
  
  let search = decodeURIComponent(req.body.search);
  let searchMethod = req.body.searchMethod;
  let filters = JSON.parse(req.body.filters);
  let pageIndex = req.body.index;
  let query;
  let params = [];

  console.log(filters.maxPrice);

  const db = require("./database-init");
  query = "SELECT DISTINCT Books.rowid, Books.* FROM Books, Authors WHERE (Books.title LIKE ? " +
          "OR ((Authors.firstName || ' ' || Authors.lastName) LIKE ? AND Authors.rowid = Books.authorID))"; 

  // check if search
  if(search == "null" || search == "") {
    params = ['%', '%'];
  }
  else {
    params = ['%' + search + '%', '%' + search + '%'];
  }

  // apply filters
  filtered = applyFilters(query, params, filters);
  query = filtered.query;
  params = filtered.params;

  let books = []; // books that will be sent to the client
  let authors = []; // authors (index corresponding to books indices) 
  let bookShowLimit = 10; // total number of books shown on page
  let bookIndex = (parseInt(pageIndex)-1) * bookShowLimit; // first book in DB which needs to be shown (based on page index) 

  let indexCounter = 0;
  let bookCounter = 0;

  // get all books
  console.log(query);
  console.log(params);
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
        console.log(book.authorID);
        authorIDs.push(book.authorID);
      });

    // get all corresponding authors
    getMultipleAuthorData(authorIDs, (authors) => {
      authors.forEach(author => {
        console.log(author);
        
      });
      // send book data back to the client
      res.send(JSON.stringify({
        nrBooks: rows,
        showBooks: books,
        showAuthors: authors
      }))
    });

  });


})

// helper function for book queries, which applies the user-specified filters
function applyFilters(query, params, filters) {
  // check price filter
  let maxPrice = filters.maxPrice;
  if(maxPrice > 0) {
    console.log(" Higher then 0");
    query += " AND Books.price < ?";
    params.push(maxPrice);
  }

  // check genre filters
  let genres = filters.genre;
  if(genres.length > 0) {
    query += " AND (";

    for(let i = 0; i < genres.length - 1; i++) {
      query += " Books.genre LIKE ? OR";
      params.push(genres[i]);
    };

    query += " Books.genre LIKE ?)";
    params.push(genres[genres.length-1]);
  }

  // check publisher filter
  let publishers = filters.publisher;
  if(publishers.length > 0) {
    query += " AND (";

    for(let i = 0; i < publishers.length - 1; i++) {
      query += " Books.publisherID = ? OR";
      params.push(publishers[i]);
    };

    query += " Books.publisherID = ?)";
    params.push(publishers[publishers.length-1]);
  }

  return {query, params};
}

router.post("/review", (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  let anonymous = req.body.anonymous;
  let bookID = req.body.bookID;
  let userID;

  const db = require("./database-init");
  db.get("SELECT rowid FROM Users WHERE email=?", [req.session.email], (err, row) => {
    userID = row.rowid;

    storeReview(new Review(title, content, anonymous), userID, bookID);

    res.sendStatus(200);
  })
});

module.exports = router;
