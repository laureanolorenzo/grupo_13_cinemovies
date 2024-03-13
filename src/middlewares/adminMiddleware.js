function adminMiddleware(req, res, next) {
    // if (req.session.userLoggedIn) {
    if (req.session.userLoggedIn?.id_rol != 1) {
        return res.redirect('/home');
    }
    next();
}
module.exports = adminMiddleware;