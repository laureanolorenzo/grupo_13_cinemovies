const path = require('path');
const fs = require('fs');

function readCategories() {
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../datos/categories.json'),{'encoding':'utf-8'}));
}

const mainController = {
    index(req,res) {
        let categs = readCategories();
        res.render('home',{categs:categs,  user: req.session.userLoggedIn });
    },
    promocionesView(req,res) {
        res.render('promociones',{ user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },
    
}
module.exports = mainController;