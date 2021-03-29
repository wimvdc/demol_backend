let mcache = require('memory-cache');
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
    },
    cache: (duration) => {
        return (req, res, next) => {
            let key = '__exprs__' + req.originalUrl || req.url
            let cachedBody = mcache.get(key)
            if (cachedBody) {
                res.send(cachedBody)
                return;
            } else {
                res.sendResponse = res.send
                res.send = (body) => {
                    mcache.put(key, body, duration * 1000);
                    res.sendResponse(body)
                }
                next();
            }
        }
    }
}