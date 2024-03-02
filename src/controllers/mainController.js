const path = require('path');
const fs = require('fs');
const db = require('../../database/models');
const {literal,Op} = require('sequelize');

function readCategories() {
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
}

const mainController = {
    async index(req,res) {
        // let categs = readCategories()
        let estrenosRandom = await db.Peliculas.findAll(
            {   where: {es_estreno: 1,
                        banner: {[Op.ne]: null},
                        origen: {[Op.like]: '%United States of America%'}}, //Tienen mejores banners!
                order: literal('rand()'),
                limit: 4}
        );
        estrenosRandom = estrenosRandom.map(x => ({
            'id':x.id,
            'banner':x.banner
        })); //Solo nos interesan esas 2 propiedades x ahora
        let categs = await db.categorias_peliculas.findAll();
        // return res.send(categs);
        res.render('home',{categs:categs,  user: req.session.userLoggedIn, estrenos: estrenosRandom });
    },
    promocionesView(req,res) {
        res.render('promociones',{ user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },
    
}
module.exports = mainController;