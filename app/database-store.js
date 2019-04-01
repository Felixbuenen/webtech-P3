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

    db.each(
        "SELECT firstName FROM Users",
        (err, row) => {
          console.log(
            row.rowid + ": " + row.firstName
          );
        }
    );
}

module.exports = { storeUser, User };