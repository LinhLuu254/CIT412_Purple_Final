const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require("models/User");
const User = mongoose.model("User");


router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});



router.post('/register', passport.authenticate('register', {session: false}), async (req, res) => {
    res.status(200).json ({
        message: 'Registration successful',
        user: req.user
    });

});

router.post('/login',
    // Passport middleware

    passport.authenticate('login', { session: false, failWithError: true}),

    //If user is available
    function (req, res) {
        console.log(req.user);
    
        const payload = { id: req.user._id, email: req.user.email } // no password in here.

        //Create a TOKEN to be return
        const token = jwt.sign( { payload }, process.env.TOP_SECRET_KEY, { expiresIn: '1d'});

        // Create an object that includes user information for the client AND the token
        loginObject = {};
        loginObject._id = req.user._id;
        loginObject.email = req.user.email;
        loginObject.accessToken = token;
        console.log(loginObject);
        return res.status(200).json(loginObject);
    },


    //If !user
    function (err, req, res ){
        errorResponse = {
            "error": {
                "name": "LoginError"
            },
            "message": "User not found",
            "statusCode": 401,
            "data": [],
            "success": false
        }
        return res.status(401).json(errorResponse);
    }
)

router.get('/me', passport.authenticate('jwt', {session: false}), (req, res) => {
    // If a valid jwt is passed in the Authorization header, just return the entire user object
    res.status(200).json(req.user);
});


module.exports = router;