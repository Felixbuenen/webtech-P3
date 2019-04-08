/**
 * This file contains the logic to update and add new entities into the database.
 */

const db = require("./database-init");

// month mapping for date formatting
const months = {
  '0': 'January',
  '1': 'Februari',
  '2': 'March',
  '3': 'April',
  '4': 'May',
  '5': 'June',
  '6': 'July',
  '7': 'August',
  '8': 'September',
  '9': 'October',
  '10': 'November',
  '11': 'December'
}

class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

class Book {
  constructor(title, authorID, publisherID, genre, image, price, nrRatings, rating) {
    this.title = title;
    this.authorID = authorID;
    this.publisherID = publisherID;
    this.genre = genre;
    this.image = image;
    this.price = price;
    this.nrRatings = nrRatings;
    this.rating = rating;
  }
}

class Author {
  constructor(firstName, lastName, image) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
  }
}

class Publisher {
  constructor(name, country, city) {
    this.name = name;
    this.country = country;
    this.city = city;
  }
}

class Review {
  constructor(title, content, anonymous) {
    this.title = title;
    this.content = content;
    this.anonymous = anonymous;
  }
}

function storeUser(user) {
  let stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?)");

  stmt.run(user.firstName, user.lastName, user.email, user.password);

  stmt.finalize();

  console.log("succesfull. all members:");

  db.each("SELECT rowid, * FROM Users", (err, row) => {
    console.log(
      row.rowid +
        ": " +
        row.firstName +
        " " +
        row.lastName +
        " " +
        row.email +
        " " +
        row.password
    );
  });
}

function updateUser(user, oldEmail) {
  let stmt = db.prepare(
    "UPDATE Users SET firstName = ?, lastName = ?, email = ?, password = ? WHERE email = ?;"
  );

  stmt.run(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    oldEmail
  );

  stmt.finalize();
}

function storePurchase(bookID, userEmail) {
  
  // get user ID
  db.get("SELECT rowid FROM Users WHERE email='" + userEmail + "'", (err, row) => {
    let userID = row.rowid;

    // insert data into purchase table
    let stmt = db.prepare(
      "INSERT INTO Purchases VALUES (?, ?, ?)"
    );

    let currentDate = getFormattedDate();
    stmt.run(bookID, userID, currentDate);
    stmt.finalize();
  });
  

}

// Date formatter helper function. Help source: https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-3.php
function getFormattedDate() {
  let today = new Date();
  let dd = today.getDate();

  let month = months[today.getMonth()]; 
  const yyyy = today.getFullYear();
  if(dd<10) 
  {
    dd=`0${dd}`;
  } 

  return `${dd} ${month} ${yyyy}`;
}

function storeReview(review, userID, bookID) {
    // insert data into purchase table
    let stmt = db.prepare(
      "INSERT INTO Reviews VALUES (?, ?, ?, ?, ?, ?)"
    );

    let date = getFormattedDate();
    stmt.run(userID, bookID, review.title, review.content, date, review.anonymous);
}

module.exports = { storeUser, updateUser, storePurchase, storeReview, User, Book, Author, Publisher, Review };
