const express = require("express");
const db = require("./app/database.js");
const dcRouter = require("./app/dc-router");
const app = express();
const port = 8050;
const expressSession = require("express-session");
const bodyParser = require("body-parser"); 

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

app.use("/dhtml", dcRouter);



/*
app.get("/", (req, res) => {
  if (req.session.name) {
    res.send("<p>Welcome " + req.session.name + "</p>");
  } else {
    res.send("<p>You are not logged in</p>");
  }

  //   res.sendfile(__dirname + "/public/html/index.html");
});

app.get("/debugLogin.html", (req, res) => {
  if (req.session.name) {
    res.send("<p>Already logged in as " + req.session.name + "</p>");
  } else {
    res.sendfile(__dirname + "/public/html/debugLogin.html");
  }

  //   res.sendfile(__dirname + "/public/html/index.html");
});
*/

app.post("/login", (req, res) => {
  req.session.name = req.body.name;
  req.session.password = req.body.password;

  res.send("<p>Welcome " + req.body.name + "</p>");
  res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
