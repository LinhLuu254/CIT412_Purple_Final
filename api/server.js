require('dotenv').config();
require('app-module-path').addPath(__dirname);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit')

//App initialization
const app = express();

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
const booksRouter = require('routes/api/v1/books');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(limiter);

//Add router to middleware
app.use('/api/v1', apiRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/books', booksRouter);

module.exports = app;
