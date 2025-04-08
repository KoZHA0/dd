const express = require("express");
const view = require("./view")
const postReq = require('./post');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const app = express();

const initializePassport = require("./passportConf");
initializePassport(passport);


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


app.use(
    session({

        secret: 'secret',

        resave: false,

        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', view)
app.use('/', postReq);




module.exports = app;
