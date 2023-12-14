const kioscoController = {
    kioscoView(req,res) {
        res.render('kiosco'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = kioscoController;