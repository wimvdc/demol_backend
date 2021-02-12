let createError = require('http-errors');
let express = require('express');
//let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let passport = require('passport');
let session = require('express-session');
let MySQLStore = require('connect-mysql')(session)
let bodyParser = require("body-parser");
let app = express();
const { mysqlPool } = require("./db/utils");
const { isLoggedIn } = require("./utils/middelware");

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static("public"));
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 2,
    expires: 1000 * 60 * 60 * 2
  },
  store: new MySQLStore({ pool: mysqlPool, secret: 'KDYS73VDZEpGHJG8ghgF(', })
}));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/security/auth'));
app.use('/v1/groups', require('./routes/groups'));
app.use('/v1/users', isLoggedIn, require('./routes/users'));
app.use('/v1/candidates', isLoggedIn, require('./routes/candidates'));
app.use('/v1/game', isLoggedIn, require('./routes/game'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  console.error(err);
  res.send();
});

module.exports = app;
