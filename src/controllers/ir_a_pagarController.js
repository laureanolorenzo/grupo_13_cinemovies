const ir_a_pagarController = {
    ir_a_pagarView(req,res) {
        res.render('ir_a_pagar', { user: req.session.userLoggedIn });
    }
}

module.exports = ir_a_pagarController;