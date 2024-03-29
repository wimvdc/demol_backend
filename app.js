let createError = require("http-errors");
let express = require("express");
//let cookieParser = require('cookie-parser');
let morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream"); // version 2.x
let cors = require("cors");
let passport = require("passport");
let session = require("express-session");
let MySQLStore = require("connect-mysql")(session);
let bodyParser = require("body-parser");
let app = express();
const logger = require("./utils/logger");
const { mysqlPool } = require("./db/utils");
const { isLoggedIn } = require("./utils/middelware");
const { webbaseurl } = require("./utils/config");

let accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});
app.use(morgan("dev", { stream: accessLogStream }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboardc4t",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
      expires: 1000 * 60 * 60 * 2,
    },
    store: new MySQLStore({ pool: mysqlPool, secret: "KDYS73V_ZEpGHJG8ghF(" }),
  })
);
app.use(
  cors({
    origin: webbaseurl.slice(0, -2),
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.disable("x-powered-by");

app.use("/auth", require("./routes/security/auth"));
app.use("/v1/groups", require("./routes/groups"));
app.use("/v1/users", isLoggedIn, require("./routes/users"));
app.use("/v1/candidates", isLoggedIn, require("./routes/candidates"));
app.use("/v1/game", isLoggedIn, require("./routes/game"));
app.use("/v1/score", isLoggedIn, require("./routes/score"));
app.use("/v1/push", isLoggedIn, require("./routes/push"));
app.use("/v1/feedback", isLoggedIn, require("./routes/feedback"));
app.use("/v1/insight", isLoggedIn, require("./routes/insight"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  res.status(err.status || 500);
  logger.error(err);
  res.send();
});

module.exports = app;
