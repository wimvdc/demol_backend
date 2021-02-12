const { webbaseurl } = require("./config");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.user && req.user.uuid) {
            return next()
        }
        res.redirect(webbaseurl + "/login")
    }
}