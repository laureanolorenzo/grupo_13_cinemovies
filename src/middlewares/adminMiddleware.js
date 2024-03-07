function adminMiddleware(req, res, next) {
    if (req.session.userLoggedIn) {
        res.locals.admin = (req.session.userId == 1);
    }
    next();
}
module.exports = adminMiddleware;