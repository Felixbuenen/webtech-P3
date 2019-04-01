const express = require("express");
const dcRouter = require("./app/scripts/dc-router");
const app = express();
const port = 8050;
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const { storeUser, User } = require("./app/scripts/database-store");
const path = require("path");
const fs = require("fs"); // file system
const morgan = require("morgan"); // Morgan logging

global.sess; // session variable
app.set("view engine", "ejs");

// Morgan logger
var logToFileStream = fs.createWriteStream(
  path.join(__dirname, "./access.log"),
  { flags: "w" }
);
app.use(
  morgan("common", {
    stream: {
      write: function(str) {
        logToFileStream.write(str + "\r\n");
      }
    }
  })
);

// register body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// register session middleware
app.use(
  expressSession({
    secret: "some-safe-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
    }
  })
);

// register static file serving
app.use(express.static(__dirname + "/public/"));

// MAYBE CHANGE TO STATIC SERVING SOMEHOW?
app.get("/", (req, res) => {
  res.render("pages/index");
});
app.get("/books.html", (req, res) => {
  res.render("pages/books");
});
app.get("/info.html", (req, res) => {
  res.render("pages/info");
});
app.get("/register.html", (req, res) => {
  let errMsg = "";
  if (req.query.error == "0")
    errMsg = "You need to specify an e-mail and password";
  else if (req.query.error == "1") errMsg = "An error occured";
  else if (req.query.error == "2") errMsg = "E-mail already exists";

  errMsg = errMsg = res.render("pages/register", { errorMessage: errMsg });
});
app.get("/debugLogin.html", (req, res) => {
  res.render("pages/debugLogin");
});

// register dynamic content javascript generation router
app.use("/dhtml", dcRouter);

app.post("/register", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;

  // no input
  if (!email || !pass) {
    res.redirect("./register.html?error=" + 0);
    return;
  }

  const db = require("./app/scripts/database-init");
  db.get("SELECT * FROM Users WHERE email='" + email + "'", (err, row) => {
    if (err != undefined) {
      res.redirect("./register.html?error=" + 1);
      return;
    }

    // email exists --> redirect user to register page
    if (row) {
      res.redirect("./register.html?error=" + 2);
      return;
    }

    global.sess = req.session;

    global.sess.fname = fname;
    global.sess.lname = lname;

    storeUser(new User(fname, lname, email, pass));

    res.redirect("/");
    res.end();
  });
});

app.post("/login", (req, res) => {
  if (global.sess) {
    if (global.sess.fname) {
      res.send("already logged in");
      return;
    }
  }

  const email = req.body.email;
  const pass = req.body.password;
  let success = false;
  global.sess = req.session;

  const db = require("./app/scripts/database-init");
  db.get("SELECT * FROM Users WHERE email='" + email + "'", (err, row) => {
    if (err != undefined) {
      console.log(err);
      res.send("an error occured");
      return;
    }

    if (row) {
      if (row.password == pass) {
        global.sess.fname = row.firstName;
        global.sess.lname = row.lastName;

        success = true;
      }

      if (success === false) {
        console.log(
          "wrong pass word '" + pass + "' (should be '" + row.password + "'"
        );
        res.redirect("debugLogin.html");
      } else {
        res.redirect("/");
      }

      res.end();
    } else {
      console.log("row not found");
      res.redirect("debugLogin.html");
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
