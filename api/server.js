require('dotenv').config();
require('app-module-path').addPath(__dirname);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//App initialization
const app = express();

//Connect to Mongo via mongoose
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then( () => { console.log('MongoDB connected via Mongoose!') } )
  .catch( (error) => { console.error(error) } );

//Routers
const apiRouter = require('./routes/api/v1');
var usersRouter = require('./routes/api/v1/users');


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


module.exports = app;
