const carritoController = {
    carritoView(req,res) {
        res.render('carrito',{ user: req.session.userLoggedIn }); // Luego agregar un objeto con los items que haya en el carrito
    }
}

module.exports = carritoController;