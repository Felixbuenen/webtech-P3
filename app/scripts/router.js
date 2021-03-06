/**
 * This file contains the router logic for the main html requests.
 */

const express = require("express");
const router = express.Router();
const Book = require('./database-store').Book;
const {getBookData, getAuthorData, getPublisherData, getReviewData, getRatingData} = require('./database-queries');

// set EJS variables
router.use((req, res, next) => {
  let pageVars = {
    loggedIn: false,
    fname: "Account",
    lname: ""
  };

  // if user is logged in...
  // CHANGED
  if (req.session.fname) {
    pageVars.fname = req.session.fname;
    pageVars.lname = req.session.lname;
    pageVars.loggedIn = true;
  }

  req.pageVars = pageVars;

  next();
});

router.get("/", (req, res) => {
  res.render("pages/index", req.pageVars);
});
router.get("/books.html", (req, res) => {
  res.render("pages/books", req.pageVars);
});
router.get("/info.html", (req, res) => {
  let bookID = req.query.bookID;
  
  // no (valid) bookID defined
  if(!bookID || isNaN(bookID)) { 
    res.redirect("/books.html");
    return;
  }

  let book;
  let author;
  let publisher;
  let reviews;
  let ratings;
  
  // request all book info
  getBookData(bookID, (data) => {
    book = data;
    getAuthorData(book.authorID, (data) => {
      author = data;
      getPublisherData(book.publisherID, (data) => {
        publisher = data;
        getReviewData(bookID, (data) => {
          reviews = data;
          getRatingData(bookID, (data) => {
            ratings = data;
            
            // all data acquired, send to client
            req.pageVars.book = book;
            req.pageVars.author = author;
            req.pageVars.publisher = publisher;
            req.pageVars.ratings = ratings;

            // couple rating with review if applicable
            for(let i = 0; i < reviews.length; i++) {
              let userID = reviews[i].userID;

              for(let j = 0; j < ratings.length; j++) {
                if(userID == ratings[j].userID) {
                  reviews[i].rating = ratings[j].rating;
                  continue;
                }
                else {
                }
              }
            }

            req.pageVars.reviews = reviews;
            console.log(reviews.length);

            res.render("pages/info", req.pageVars);
          })
        })

      })
    })
  });
});
router.get("/register.html", (req, res) => {
  let errMsg = "";
  if (req.query.error == "0")
    errMsg = "You need to specify an e-mail and password";
  else if (req.query.error == "1") errMsg = "An error occured";
  else if (req.query.error == "2") errMsg = "E-mail already exists";

  req.pageVars.errorMessage = errMsg;
  errMsg = errMsg = res.render("pages/register", req.pageVars);
});
router.get("/profile.html", (req, res) => {
  if (req.pageVars.loggedIn) {

    let purchases = [];
    let reviews = [];
    let userID;
    // get purchase data
    const db = require('./database-init');
    db.get("SELECT rowid FROM Users WHERE email=?", [req.session.email], (err, row) => {
      userID = row.rowid;
      db.each("SELECT Books.rowid, Books.title as bookTitle, Books.image as image, Purchases.* FROM Books, Purchases WHERE Purchases.userID=? AND Purchases.bookID=Books.rowid", [userID], (err, row) => {
        purchases.push({title: row.bookTitle, date: row.date, image: row.image});
      }, (err, rows) => {

        // get review data
        db.each("SELECT Books.title as bookTitle, Reviews.date as date, Reviews.content as content FROM Books, Reviews WHERE Reviews.userID=? AND Reviews.bookID=Books.rowid", [userID], (err, row) => {
          reviews.push({bookTitle: row.bookTitle, date: row.date, content: row.content});
        }, (err, rows) => {

          req.pageVars.purchases = purchases;
          req.pageVars.reviews = reviews;
          res.render("pages/profile", req.pageVars);
        })
        
      })
    })
  } else {
    res.redirect("/");
  }
});
router.get("/settings.html", (req, res) => {
  if (req.session.fname) {
    req.pageVars.email = req.session.email;
    res.render("pages/settings", req.pageVars);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
