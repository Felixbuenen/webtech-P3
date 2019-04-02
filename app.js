/**
 * This is the entry point of our server and should be
 * considered as the 'main' file. From here, the server is initialized.
 */

const express = require("express");
const router = require("./app/scripts/router");
const dcRouter = require("./app/scripts/dc-router");
const registerRouter = require("./app/scripts/registerRouter");
const app = express();
const port = 8050;
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const { storeUser, User } = require("./app/scripts/database-store");
const path = require("path");
const fs = require("fs"); // file system
const morgan = require("morgan"); // Morgan logging

// session variable
global.sess;

// set EJS to be our view engine
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

// register (dynamic) html file router
app.use("/", router);

// register dynamic content javascript generation router
app.use("/dhtml", dcRouter);

// register the register/login handler
app.use("/", registerRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
