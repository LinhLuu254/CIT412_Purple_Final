const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require("models/User");
const User = mongoose.model("User");
const {PubSub} = require('@google-cloud/pubsub');


router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});


router.post('/register', passport.authenticate('register', {session: false}), async (req, res) => {
    // Creates a client; cache this for further use
    const pubSubClient = new PubSub();
   
    // Extract user data from the request body
    const { email, name, phone } = req.body;

    // Set the Pub/Sub topic name
    const pubsub_topic = "email_signup";

    // Prepare user data as a JSON object
    const userData = JSON.stringify({
        email_address: email,
        user_name: name,
        user_phone: phone
    });

    // Create a data buffer to stream the message to the topic
    const dataBuffer = Buffer.from(userData);

    try {
        // Publish the message to the Pub/Sub topic
        const messageId = await pubSubClient.topic(pubsub_topic).publishMessage({ data: dataBuffer });
        console.log(`Message ID: ${messageId}`);

        // Send a response to the client indicating successful registration along with the message ID
        res.status(200).json({
            message: 'Registration successful',
            user: req.user,
            messageId: messageId
        });
    } catch (error) {
        // Handle errors if message publishing fails
        console.error(`Error while publishing message: ${error.message}`);
        res.status(500).json({ error: 'Error occurred during registration' });
    }
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