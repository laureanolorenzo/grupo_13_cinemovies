const fs = require('fs');
const path = require('path');



const loginController = {
    loginView(req,res) {
        let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
        let users = JSON.parse(usersString);
        res.render('login',{'errormsg':''})
    },
    postLoginData(req,res) {
        let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
        let users = JSON.parse(usersString);
        const username = req.body.user;
        const password = req.body.password;
        let user = users.find((u) => u.username === username);
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