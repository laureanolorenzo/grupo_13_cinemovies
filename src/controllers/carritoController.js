const carritoController = {
    carritoView(req,res) {
        res.render('carrito',{ user: req.session.userLoggedIn }); // Luego agregar un objeto con los items que haya en el carrito
    },
    ir_a_pagarView(req,res) {
        res.render('ir_a_pagar', { user: req.session.userLoggedIn });
    }
}

module.exports = carritoController;