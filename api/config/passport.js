//Requires
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/User');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// HELPER FUNCTIONS

// Define a function that accepts an email and password and creates a user in the database
let createUser = async(email, password, name, phone, cb) => {
    try {
        const user = await UserModel.create({email, password, name, phone});
        return cb(null, user);
    } catch (err) {
        cb(err);
    }
}

// Define a function that will process an email and password against the database
let authenticateLogin = async (email, password, cb) => {
    // Search Mongo for the user with the supplied email
    UserModel.findOne({email})
    .then(async (user) => {
 
        if (!user) {
            return cb(null, false);
        }

        const isValidPwd = await user.isValidPassword(password);

        if (isValidPwd) {
            return cb(null, user);
        } else {
            return cb(null, false);
        }
    })
    .catch((err) => {
        // This is an actual application error; something has gone wrong
        cb(err);
    });
};

// Define a function that extracts a user ID from a given token
let getUserFromToken = async (token, cb) => {
    try {
        return cb(null, token.payload);
    } catch(err) {
        cb(err);
    }
}


// PASSPORT MIDDLEWARE
// 1 - Local strategy for registering a user
passport.use(
    // Nickname
    'register',
    // Strategy implementation
    new localStrategy(
        // Passport expects fields named "username" and "password"
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true 
        },
        // Pass a function that defines how the user is written to the db
        (req, email, password, cb) => {
            const { name, phone } = req.body; // Extract additional fields from request body
            createUser(email, password, name, phone, cb); // Call createUser function with additional fields
        }
    )
);


// 2 - Local strategy for logging in a user
// Define a passport instance that uses the localStrategy for logging in a user with email/password
passport.use(
    // This is the nickname that allows us to invoke this passport functionality
    'login',
    // Create a new local Strategy to interact with our database
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      // Use our defined function that processes the email and password to find a user
      authenticateLogin
      )    
);


// 3 - JWT strategy for reading a token and providing access to a resource
passport.use(
    new JWTstrategy(
        // Passport retrieves the token from the request header and uses the secret key in the .env file to determine which user sent the request
        // It then calls a function that extracts a user object and returns it (getUserFromToken)
        {
            secretOrKey: process.env.TOP_SECRET_KEY,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        // Use our helper function that returns the user object based on the token
        getUserFromToken
    )
);