function ingresarAPerfilMiddleware(req, res, next) {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login')
    }
    next();
}

module.exports = ingresarAPerfilMiddleware;