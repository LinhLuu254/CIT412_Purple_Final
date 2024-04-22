const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require("models/User");
const Book = require("models/Book");
const {PubSub} = require('@google-cloud/pubsub');


router.get('/all', async (req, res) => {
    const {
        i = "false",
        b = i,
        ib = b,
        include_books = ib
    } = req.query;

    const users = (await User.find()).map(user => user.toJSON());

    // Do not return with the password hash
    users.forEach(user => delete user.password);

    if (include_books === "true") {
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users[i].favorites.length; j++) {
                const book = await Book.findById(users[i].favorites[j]);
                users[i].favorites[j] = book.toJSON();
            }
        }
    }

    res.json(users);
});

router.get("/one/:id", async (req, res) => {
    const {
        i = "false",
        b = i,
        ib = b,
        include_books = ib
    } = req.query;

    const user = (await User.findById(req.params.id)).toJSON();

    // Do not return with the password hash
    delete user.password;

    if (include_books === "true") {
       for (let i = 0; i < user.favorites.length; i++) {
            const book = await Book.findById(user.favorites[i]);
            user.favorites[i] = book.toJSON();
       }
    }

    res.json(user);
});

router.patch("/one/:id", async (req, res) => {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updated);
});

router.post("/one/:user_id/toggle-favorite/:book_id",
    passport.authenticate('jwt', { session: false}),

    // Authenticated
    async (req, res) => {
        if (req.user.id !== req.params.user_id) return res.status(401).json({message: "Unauthorized"});

        const user = (await User.findById(req.params.user_id)).toJSON();
        const bookId = req.params.book_id;
        const favorites = user.favorites.map(id => id.toString());

        if (favorites.includes(bookId)) {
            user.favorites = favorites.filter(id => id !== bookId);
        } else {
            user.favorites.push(bookId);
        }

        const result = await User.findByIdAndUpdate(req.params.user_id, {favorites: user.favorites}, {new: true});
        res.json(result);
    }
);


router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
  
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

    async function publishMessage(topicNameOrId, data) {
        // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
        const dataBuffer = Buffer.from(data);
        
        try {
            const messageId = await pubSubClient
            .topic(topicNameOrId)
            .publishMessage({data: dataBuffer});
            console.log(`Message ${messageId} published.`);
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`);
            process.exitCode = 1;
        }
        }

    publishMessage(pubsub_topic, userData);

    res.status(200).json({
        message: 'Registration successful',
        user: req.user,
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