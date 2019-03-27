const express = require("express");
const db = require("./app/database.js");
const app = express();
const port = 8050;
const expressSession = require("express-session");

// register session middleware
app.use(expressSession({ secret: "some-safe-secret" }));

app.post("/login", (req, res) => {
  res.send("<p>Logged in</p>");
  res.end();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/html/debugLogin.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
