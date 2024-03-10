function loggedInMiddleware(req, res, next) {
    if (req.session.userLoggedIn) {
        // application.locals.userLoggedIn = req.session.userLoggedIn 
        res.locals.user = req.session.userLoggedIn;
    }
    next();
}

module.exports = loggedInMiddleware;