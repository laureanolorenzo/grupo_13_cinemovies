const kioscoController = {
    kioscoView(req,res) {
        res.render('kiosco', { user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = kioscoController;