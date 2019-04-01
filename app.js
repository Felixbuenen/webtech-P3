const express = require("express");
const dcRouter = require("./app/scripts/dc-router");
const app = express();
const port = 8050;
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const { storeUser, User } = require("./app/scripts/database-store");

global.sess; // session variable

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// register session middleware
app.use(expressSession({ 
  secret: "some-safe-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
  }
 }));

// register static file serving
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/html"));

// register dynamic content javascript generation router
app.use("/dhtml", dcRouter);

app.post("/register", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;

  global.sess = req.session;

  global.sess.fname = fname;
  global.sess.lname = lname;

  storeUser(new User(fname, lname, email, pass));

  res.redirect("/");
  res.end();
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  let success = false;
  global.sess = req.session;

  const db = require('./app/scripts/database-init');
  db.get(
    "SELECT * FROM Users WHERE email='" + email + "'",
    (err, row) => {
      if(err != undefined) {
        console.log(err);
        res.send("an error occured");
        return;
      }

      if(row) {
        if(row.password == pass) {
          global.sess.fname = row.firstname;
          global.sess.lname = row.lastname;
  
  
          success = true;
        }
  
        if(success === false) {
          res.send("<p>Username or password incorrect</p>");
        }
        else {
          res.send("<p>Logged in as " + row.firstName + " " + row.lastName + "</p>");
        }
      
        res.end();
      }
      else {
          res.send("<p>Username or password incorrect</p>");
      }

    }
  );
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
