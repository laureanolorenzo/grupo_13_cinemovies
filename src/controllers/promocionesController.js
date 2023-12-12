const promocionesController = {
    promocionesView(req,res) {
        res.render('promociones'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = promocionesController;