const express = require("express");
const dcRouter = require("./app/dc-router");
const app = express();
const port = 8050;
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const { storeUser, User } = require("./app/database-store");

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

// register body / json parser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

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

  req.session.fname = fname;
  req.session.lname = lname;

  storeUser(new User(fname, lname, email, pass));

  res.end();

  // TO DO: encryption, redirection, closing DB
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
