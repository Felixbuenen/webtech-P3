/**
 * This is the dynamic content router file. It defines a router which sends the correct JS code 
 * to the client, based on whether or not the user is logged in. We can then use this JS code on the client side
 * to build up the dynamic website (using DOM manipulation).
 */
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if(req.session.name) {
        req.dir = __dirname + "/scripts/dynamic_content/loggedin";
    }
    else {
        req.dir = __dirname + "/scripts/dynamic_content/notloggedin";
    }

    next();
})

router.get("*", (req, res) => {
    res.sendFile(req.dir + req.path);
});

module.exports = router;