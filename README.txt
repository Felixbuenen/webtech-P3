README
Web Technology Assignment 3

GROUP 50
Felix Buenen - 5534518
Nathan van Ginkel - 5940168
Aischa Hu - 6618375

The live version of the website can be found at http://webtech.science.uu.nl/group50/
We have implemented extra Social Web features: user ratings and reviews.


DATABASE

The database is best explained through the following ER-diagram:
https://drive.google.com/open?id=1haAPYgRWmGxisAa2FSTr-aMaDC5_oN3M
If this link should be down for some reason, please e-mail Felix (f.w.m.buenen@uu.nl) for a downloadable copy of the diagram.


SQL DEFINITION
In the database-init.js file you will find the following SQL CREATE statements:

CREATE TABLE Books (title TEXT, authorID INT, publisherID INT, genre TEXT, image TEXT, price REAL, nrRatings INT, rating FLOAT)

CREATE TABLE Users (firstName TEXT, lastName TEXT, email TEXT, password TEXT)

CREATE TABLE Purchases (bookID INT, userID INT, date TEXT)

CREATE TABLE Ratings (userID INT, bookID INT, rating TINYINT)

CREATE TABLE Reviews (userID INT, bookID INT, content TEXT, date TEXT, ananymous BOOLEAN)

CREATE TABLE Authors (firstName TEXT, lastName TEXT, image TEXT)

CREATE TABLE Publishers (name TEXT, country TEXT, city TEXT)


WEBSITE FEATURES EXPLANATION

Our webshop features an account system, where customers can register with their e-mail address and a password.
Once a user has an account, they can make purchases, give books a rating, and write reviews. Each registered
user has an account page, which offers an overview of their purchases and reviews.

The website has a main page, which shows a predetermined featured book with some basic information, including
its price and its average rating. In the header, customers can click on the “Books” button to browse through the
entire catalogue of the store. Users can also use the search bar on top of each page to search for books in the
catalogue. They can even choose whether they want to specifically search for an author or a title. The results
page offers the opportunity to filter the search results, based on price, genre and publisher. When a user has
found an interesting book, they can click on its information box, which will send them to the book’s information
page.

On each book’s information page, the user can buy the book, as well as look up more information about the book and
its author. When logged in, users can also leave a rating and a review. All users, regardless of whether they are
registered or not, can read reviews by other customers at the bottom of the page.