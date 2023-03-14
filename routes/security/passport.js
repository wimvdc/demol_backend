const { facebook, google } = require("../../utils/config");
const passport = require("passport");
const db = require("../../db/auth");
const logger = require("../../utils/logger");
let FacebookStrategy = require("passport-facebook").Strategy;
let GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new FacebookStrategy(facebook, function (accessToken, refreshToken, profile, cb) {
    let names = profile.displayName.split(" ");
    let firstname = names[0],
      lastname = names[0];
    if (names.length > 1) {
      firstname = names[0];
      names.shift();
      lastname = names.join(" ");
    }
    const user = {
      id: profile.id,
      firstname: firstname,
      lastname: lastname,
      media: "fb",
      token: accessToken,
    };
    cb(null, user);
  })
);

passport.use(
  new GoogleStrategy(google, function (accessToken, refreshToken, profile, cb) {
    const user = {
      id: profile.id,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      media: "google",
      token: accessToken,
    };
    return cb(null, user);
  })
);

passport.serializeUser(function (user, done) {
  db.getUserIdByOpenId(user.id).then((result) => {
    if (result[0]) {
      user.uuid = result[0].uuid;
      done(null, user);
    } else {
      db.insertUser(user.id, user.firstname, user.lastname, user.media).then(() => {
        db.getUserIdByOpenId(user.id).then((result) => {
          user.uuid = result[0].uuid;
          done(null, user);
        });
      });
    }
  });
});

passport.deserializeUser(function (user, done) {
  db.getUserIdByOpenId(user.id).then((result) => {
    user.uuid = result[0].uuid;
    done(null, user);
  });
});

module.exports = passport;
