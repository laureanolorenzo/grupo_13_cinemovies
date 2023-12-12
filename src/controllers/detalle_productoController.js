const detalle_productoController = {
    detalle_productoView(req,res) {
        res.render('detalle_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = detalle_productoController;