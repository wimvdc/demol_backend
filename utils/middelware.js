const { webbaseurl } = require("./config");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.user && req.user.uuid) {
            return next()
        }
        res.redirect(webbaseurl + "/login")
    },
    isAdminLoggedIn: (req, res, next) => {
        if (req.user && req.user.uuid && req.uuid === 'eea5bd41-84fb-11eb-841a-42010a840022') {
            return next()
        }
        res.redirect(webbaseurl + "/login")
    }
}