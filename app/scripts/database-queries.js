/**
 * This file contains functionality to query data from the database.
 */

 const db = require('./database-init');
 const Book = require('./database-store').Book;
 const Author = require('./database-store').Author;
 const Publisher = require('./database-store').Publisher;

 function getBookData(bookID, func) {
    // get book data
    db.get("SELECT * FROM Books WHERE Books.rowid = ?", [bookID], (err, row) => {
        // no book found
        if(!row) { 
            func(null);
            return;
        }

        let book = new Book(row.title, row.authorID, row.publisherID, row.genre, row.image, row.price, row.nrRatings, row.rating);
        func(book);
    });
 }

 function getAuthorData(authorID, func) {
    db.get("SELECT * FROM Authors WHERE Authors.rowid = ?", [authorID], (err, row) => {
        // no author found
        if(!row) { 
            func(null);
            return;
        }

        let author = new Author(row.firstName, row.lastName, row.image);
        func(author);
    });
 }

 // returns a list of authors, given a list of ID's
 function getMultipleAuthorData(authorIDs, doneFunc) {
    let length = authorIDs.length;
    
    if(length == 0) {
        // no search results, send back empty array
        doneFunc([]);
        return;
    }

    let authors = [];
    getMultipleAuthorDataHelper(authorIDs[0], authorIDs, authors, 0, length, doneFunc);
    
 }
 
 function getMultipleAuthorDataHelper(id, authorIDs, authors, counter, max, doneFunc) {
    getAuthorData(id, (author) => {
        if(counter == max) {
            doneFunc(authors);
            return;
        }else {
            console.log("Pushing new author..." + author.firstName);
            authors.push(author);
            counter++;
            getMultipleAuthorDataHelper(authorIDs[counter], authorIDs, authors, counter, max, doneFunc);
        }
    }) 
 }

 function getPublisherData(publisherID, func) {
    db.get("SELECT * FROM Publishers WHERE Publishers.rowid = ?", [publisherID], (err, row) => {
        // no publisher found
        if(!row) { 
            func(null);
            return;
        }

        let publisher = new Publisher(row.name, row.country, row.city);
        func(publisher);
    });
 }

 module.exports = {getBookData, getAuthorData, getPublisherData, getMultipleAuthorData}