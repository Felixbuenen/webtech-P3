/**
 * This file contains the router logic for the main html requests.
 */

const express = require("express");
const router = express.Router();
const Book = require('./database-store').Book;
const {getBookData, getAuthorData, getPublisherData} = require('./database-queries');

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
  
  // request all book info
  getBookData(bookID, (data) => {
    book = data;
    getAuthorData(book.authorID, (data) => {
      author = data;
      getPublisherData(book.publisherID, (data) => {
        publisher = data;

        // all data acquired, send to client
        req.pageVars.book = book;
        req.pageVars.author = author;
        req.pageVars.publisher = publisher;

        res.render("pages/info", req.pageVars);
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
    res.render("pages/profile", req.pageVars);
  } else {
    res.redirect("/");
  }
});
router.get("/settings.html", (req, res) => {
  if (req.pageVars.loggedIn) {
    req.pageVars.email = global.sess.email;
    res.render("pages/settings", req.pageVars);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
