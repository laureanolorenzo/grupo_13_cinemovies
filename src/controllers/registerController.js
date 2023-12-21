const path = require('path');
const fs = require('fs');
const usersPath = path.join(__dirname,'../datos/users.json')


const registerController = {
    registerView(req,res) {
        res.render('registro')
    },
    postRegisterData(req,res) {
        let usersString = fs.readFileSync(usersPath,{encoding:'utf-8'});
        let users = JSON.parse(usersString);
        users.push(req.body);
        usersToSave = JSON.stringify(users, null, " ");
        fs.writeFileSync(usersPath,usersToSave,{encoding: 'utf-8'})
        res.redirect('home')
    }
}
module.exports = registerController;