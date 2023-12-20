const fs = require ('fs');
const path = require ('path');

const edicion_productoController = {
    edicion_productoView(req,res) {
        res.render('edicion_producto'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    edicion_productoProcess(req,res) {
        let movies = fs.readFileSync(path.resolve(__dirname, '../datos/movies.json'), 'utf-8');
        let moviesObj = JSON.parse(movies);

    },
}

module.exports = edicion_productoController;
