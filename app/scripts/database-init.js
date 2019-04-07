/**
 * This file contains the initialisation logic of the database.
 */

let fs = require("fs");
let sqlite = require("sqlite3").verbose();

let dbFile = __dirname + "/database.db";
let fileExists = fs.existsSync(dbFile);

if (!fileExists) {
  fs.openSync(dbFile, "w");
}

let db = new sqlite.Database(dbFile);

db.serialize(function() {
  if (!fileExists) {
    setupDB();
  }

  // example query
  db.each(
    "SELECT name FROM Publishers, Books WHERE Publishers.rowid = Books.publisherID AND Books.title = 'Harry Potter and the Prisoner'",
    (err, row) => {
      console.log(
        "The publisher of Harry Potter and the Prisoner is: " + row.name
      );
    }
  );
});

function setupDB() {
  initBookTable();
  initUserTable();
  initPurchasesTable();
  initRatings();
  initReviews();
  initAuthors();
  initPublishers();
}


// ---------------- INITIALISATION OF DATABASE ---------------

function initBookTable() {

  db.run(
    "CREATE TABLE Books (title TEXT, authorID INT, publisherID INT, genre TEXT, image TEXT, price REAL, nrRatings INT, rating FLOAT)"
  );
  let stmt = db.prepare("INSERT INTO Books VALUES (?,?,?,?,?,?,?,?)");

  // read and parse JSON book data
  let bookFile = fs.readFileSync(__dirname + "/../data/books.json", "utf8");
  let bookData = JSON.parse(bookFile);

  let imgPath = "./images/bookCovers/";
  bookData.forEach(book => {
    stmt.run(book['title'], book['authorID'], book['publisherID'], book['genre'], imgPath + book['image'], book['price'], book['nrRatings'], book['rating']);
  });

  stmt.finalize();
}

function initUserTable() {
  db.run(
    "CREATE TABLE Users (firstName TEXT, lastName TEXT, email TEXT, password TEXT)"
  );

  let stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?)");

  // example data
  stmt.run("Felix", "Buenen", "felix@gmail.com", "felix");
}

function initPurchasesTable() {
  db.run("CREATE TABLE Purchases (bookID INT, userID INT, date TEXT)");

  let stmt = db.prepare("INSERT INTO Purchases VALUES (?,?,?)");

  // example data for user 1 (Felix)
  stmt.run(1, 1, "2016-12-21 09:36:01");
  stmt.run(2, 1, "2012-11-21 09:36:01");

  stmt.finalize();
}

function initRatings() {
  db.run("CREATE TABLE Ratings (userID INT, bookID INT, rating TINYINT)");

  let stmt = db.prepare("INSERT INTO Ratings VALUES (?,?,?)");

  // example data
  stmt.run(0, 0, 5);
  stmt.run(0, 1, 4);
  stmt.run(1, 0, 5);
  stmt.run(1, 1, 2);

  stmt.finalize();
}

function initReviews() {
  db.run(
    "CREATE TABLE Reviews (userID INT, bookID INT, content TEXT, date DATETIME, ananymous BOOLEAN)"
  );

  let stmt = db.prepare("INSERT INTO Reviews VALUES (?,?,?,?,?)");

  // example data
  stmt.run(
    0,
    0,
    "This is a review book was good groetjes.",
    "2019-06-17 16:21:23",
    0
  );
  stmt.run(
    1,
    1,
    "Another review didn't like the book so I want to be ananymous",
    "2011-08-42 12:26:21",
    1
  );

  stmt.finalize();
}

function initAuthors() {
  db.run("CREATE TABLE Authors (firstName TEXT, lastName TEXT, image TEXT)");

  let stmt = db.prepare("INSERT INTO Authors VALUES (?,?,?)");

  // read and parse JSON book data
  let authorsFile = fs.readFileSync(__dirname + "/../data/authors.json", "utf8");
  let authorsData = JSON.parse(authorsFile);

  let imgPath = "./images/authors/";
  authorsData.forEach(author => {
    stmt.run(author['firstName'], author['lastName'], imgPath + author['image']);
  });

  stmt.finalize();
}

function initPublishers() {
  db.run("CREATE TABLE Publishers (name TEXT, country TEXT, city TEXT)");

  let stmt = db.prepare("INSERT INTO Publishers VALUES (?,?,?)");

  // read and parse JSON book data
  let publishersFile = fs.readFileSync(__dirname + "/../data/publishers.json", "utf8");
  let publishersData = JSON.parse(publishersFile);

  let imgPath = "./images/authors/";
  publishersData.forEach(publisher => {
    stmt.run(publisher['name'], publisher['country'], publisher['city']);
  });

  stmt.finalize();
}

module.exports = db;
