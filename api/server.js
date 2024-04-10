require('dotenv').config();
require('app-module-path').addPath(__dirname);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const SpotifyWebApi = require('spotify-web-api-node');

//App initialization
const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: (process.env.NODE_ENV === 'development' && process.env.SPOTIFY_REDIRECT_URI_DEV) || process.env.SPOTIFY_REDIRECT_URI_PROD
});

spotifyApi.clientCredentialsGrant().then((data) => {
  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);

  console.log("Spotify access token set!");
  console.log("Exires in", data.body.expires_in, "seconds");
}).catch((error) => {
  console.error('Error getting Spotify access token:', error);
});

// Passport initialization
// Makes passport available throughout the app
require('config/passport');

//Configure the rate limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Connect to Mongo via mongoose
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then( () => { console.log('MongoDB connected via Mongoose!') } )
  .catch( (error) => { console.error(error) } );

//Routers
const apiRouter = require('routes/api/v1');
const usersRouter = require('routes/api/v1/users');
const musicRouter = require('routes/api/v1/music');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Add router to middleware
app.use('/api/v1', apiRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/music', musicRouter);

module.exports = { app, spotifyApi };
