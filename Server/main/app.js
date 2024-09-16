const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const crypto = require('crypto')

const cors = require('cors');

const session = require('express-session')

const postRouter = require('./routes/postRoutes')
const authRouter = require('./routes/authRoutes')
const commentRouter = require('./routes/commentRoutes')
const relationRouter = require('./routes/relationRoutes')
const tagRouter = require('./routes/tagRoutes')

const app = express();

const secretKey = crypto.randomBytes(32).toString('hex')

app.use(cors({
    origin: 'https://refactored-space-barnacle-q5v997wpr5xh5xv-3000.app.github.dev/',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
    }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/comment', commentRouter);
app.use('/rel', relationRouter);
app.use('/tag', tagRouter);

app.use(express.static('public'));



module.exports = app;
