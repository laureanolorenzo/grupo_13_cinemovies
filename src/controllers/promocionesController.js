const promocionesController = {
    promocionesView(req,res) {
        res.render('promociones',{ user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = promocionesController;