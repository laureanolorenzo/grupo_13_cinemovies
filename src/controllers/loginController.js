const fs = require('fs');
const path = require('path');

let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
let users = JSON.parse(usersString);

const loginController = {
    loginView(req,res) {
        res.render('login',{'errormsg':''})
    },
    postLoginData(req,res) {
        let username = req.body.usuario;
        let password = req.body.contraseña;
        let user = users.filter((u) => u.username === username)[0];
        if (user && user['password'] !== password) {
            res.render('login',{'errormsg':'La contraseña es incorrecta'});
            
        } else if (!(user)) {
            res.render('login',{'errormsg':'No se ha encontrado al usuario'});

        } else if (user && user['password'] === password) {
            res.redirect('home');
        }
    }
}
module.exports = loginController;