const express = require('express')
const db = require("./app/database.js");
const app = express()
const port = 8050

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))