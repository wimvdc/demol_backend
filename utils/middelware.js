const { webbaseurl } = require("./config");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.user && req.user.uuid) {
            return next()
        }
        res.redirect(webbaseurl + "/login")
    },
    isAdminLoggedIn: (req, res, next) => {
        if (req.user.uuid === '18dfd515-8758-11eb-bec5-42010a840056' &&
            req.user.id === '117164228083016343480') {
            console.log("next")
            return next()
        } else {
            console.log('redirect')
            res.redirect(webbaseurl + "/login")
        }
    }
}