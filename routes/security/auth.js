const router = require("express").Router();
const passport = require("./passport");
const logger = require("../../utils/logger");
const { webbaseurl } = require("../../utils/config");

router.get("/v1/facebook", passport.authenticate("facebook"));

router.get(
  "/v1/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: webbaseurl + "/",
    failureRedirect: "/login",
  })
);

router.get("/v1/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
  "/v1/google/callback",
  passport.authenticate("google", { failureRedirect: webbaseurl + "/login" }),
  function (req, res) {
    res.redirect(webbaseurl + "/");
  }
);

router.get("/v1/check", function (req, res) {
  req.user ? res.sendStatus(200) : res.sendStatus(401);
});

router.get("/v1/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.clearCookie("connect.sid");
    res.redirect(webbaseurl + "/login");
  });
});

module.exports = router;
