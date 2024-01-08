const categoriasController = {
    categoriasView(req,res) {
        res.render('categorias'); // Luego incluir datos de cada categoria en particular!!
    },

    drama: (req,res)=>{
        res.render ('categoria_drama');
    }
}

module.exports = categoriasController;