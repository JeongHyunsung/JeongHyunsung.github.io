const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const crypto = require('crypto')

const cors = require('cors');

const session = require('express-session')

const indexRouter = require('./routes')

const app = express();

const secretKey = crypto.randomBytes(32).toString('hex')
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60
    }
}))

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', indexRouter);
app.use(express.static('public'));



module.exports = app;
