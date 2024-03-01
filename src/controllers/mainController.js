const path = require('path');
const fs = require('fs');
const db = require('../../database/models');

function readCategories() {
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
}

const mainController = {
    async index(req,res) {
        // let categs = readCategories()
        let categs = await db.categorias_peliculas.findAll();
        // return res.send(categs);
        res.render('home',{categs:categs,  user: req.session.userLoggedIn });
    },
    promocionesView(req,res) {
        res.render('promociones',{ user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },
    
}
module.exports = mainController;