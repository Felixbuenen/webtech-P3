/**
 * This is the dynamic content router file. It defines a router which sends the correct JS code 
 * to the client, based on whether or not the user is logged in. We can then use this JS code on the client side
 * to build up the dynamic website (using DOM manipulation).
 */
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    //console.log(global.sess.fname);
    if(global.sess) {
        if (global.sess.fname) {
            req.dir = __dirname + "/dynamic_content/loggedin";
        }
        else {
            console.log("session defined but no fname");
            req.dir = __dirname + "/dynamic_content/notloggedin";
        }
    }
    else {
        req.dir = __dirname + "/dynamic_content/notloggedin";
    }

    next();
})

router.get("*", (req, res) => {
    res.sendFile(req.dir + req.path);
});

module.exports = router;