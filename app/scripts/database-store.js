/**
 * This file contains the logic to update and add new entities into the database.
 */

const db = require("./database-init");

class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

class Book {
  constructor(name, author, numPages, publisher, isbn, imageRef) {
    this.name = name;
    this.author = author;
    this.numPages = numPages;
    this.publisher = publisher;
    this.isbn = isbn;
    this.imageRef = imageRef;
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

function updateUser(user) {
  let stmt = db.prepare(
    "UPDATE Users SET firstName = ?, lastName = ?, email = ?, password = ? WHERE email = ?;"
  );

  stmt.run(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    global.sess.email
  );

  stmt.finalize();
}

function storePurchase(bookID) {
  
  // get user ID
  db.get("SELECT rowid FROM Users WHERE email='" + global.sess.email + "'", (err, row) => {
    let userID = row.rowid;

    // insert data into purchase table
    let stmt = db.prepare(
      "UPDATE Purchases SET userID = ?, bookID = ?, date =" + Date.now()
    );

    stmt.run(userID, bookID);
    stmt.finalize();
  });
  

}

module.exports = { storeUser, updateUser, storePurchase, User };
