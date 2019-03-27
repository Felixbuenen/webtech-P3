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

db.close();

function setupDB() {
  initBookTable();
  initUserTable();
  initPurchasesTable();
  initRatings();
  initReviews();
  initAuthors();
  initPublishers();
}

function initBookTable() {
  db.run(
    "CREATE TABLE Books (title TEXT, authorID INT, publisherID INT, genre TEXT, image TEXT, price REAL, nrRatings INT, rating FLOAT)"
  );

  let stmt = db.prepare("INSERT INTO Books VALUES (?,?,?,?,?,?,?,?)");

  // example data
  stmt.run(
    "Harry Potter and the Prisoner",
    1,
    1,
    "Fantasy",
    "./images/hp.png",
    14.99,
    50,
    4.3
  );
  stmt.run("Doom's Day", 37, 1, "War", "./images/dd.png", 11.99, 24, 3.6);

  stmt.finalize();
}

function initUserTable() {
  db.run(
    "CREATE TABLE Users (firstName TEXT, lastName TEXT, email TEXT, password TEXT)"
  );

  let stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?)");

  // example data
  stmt.run("Felix", "Buenen", "felixbuenen@hotmail.com", "encryptedpassword");
  stmt.run("Desiree", "Van Den Braak", "desireevdbraak@gmail.com", "1234_whoo");

  stmt.finalize();
}

function initPurchasesTable() {
  db.run("CREATE TABLE Purchases (bookID INT, userID INT, date DATETIME)");

  let stmt = db.prepare("INSERT INTO Purchases VALUES (?,?,?)");

  // example data
  stmt.run(1, 0, "2014-04-26 16:21:53");
  stmt.run(0, 1, "2016-12-21 09:36:01");

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

  // example data
  stmt.run("J.", "K. Rowling", "./images/jk-rowling.png");
  stmt.run("Frank", "Herbert", "./images/herbert.png");

  stmt.finalize();
}

function initPublishers() {
  db.run("CREATE TABLE Publishers (name TEXT, country TEXT, city TEXT)");

  let stmt = db.prepare("INSERT INTO Publishers VALUES (?,?,?)");

  // example data
  stmt.run("Bloomsbury", "England", "London");
  stmt.run("Books LTD", "The Netherlands", "Utrecht");

  stmt.finalize();
}
