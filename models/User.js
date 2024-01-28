const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { all } = require('../src/routes/usersRouter');
const { type } = require('os');

const User = {

    fileName: '../src/datos/users.json',

    getData: function() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, this.fileName), {encoding:'utf-8'}));
    },

    generateId: function() {
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();
        if (lastUser) {
            return lastUser.id + 1;
        }
        return 1;
    },

    findAll: function(){
        return this.getData();
    },

    findByPk: function(id) {  //busca elementos por id
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser.id === id);
    },

    findByField: function(field, text) {  //busca elementos por id trae EL PRIMERO que se encuentra. Por ejemplo si hay dos con el mismo nombre te trae el primero
        let allUsers = this.findAll();
        let userFound;
        if (typeof field == 'object') {
            for (const f of field) {
                userFound = allUsers.find(oneUser => oneUser[f] === text)
                if (typeof userFound !== 'undefined') {return userFound}
            }
        }
        userFound = allUsers.find(oneUser => oneUser[field] === text);
        return userFound
    },

    create: function (userData) {
        let allUsers = this.findAll(); 
        let newUser = {
            id: this.generateId(),
            ...userData
        }
        delete newUser.passwordRepeat;
        newUser.password = bcrypt.hashSync(newUser.password,10);
        // newUser.passwordRepeat = bcrypt.hashSync(newUser.passwordRepeat);
        allUsers.push(newUser);
        fs.writeFileSync(path.join(__dirname, this.fileName), JSON.stringify(allUsers, null, ' '));
    },

    delete: function(id) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id != id);
        fs.writeFileSync(path.join(__dirname, this.fileName), JSON.stringify(finalUsers, null, ' '));
        return true
    }

};

module.exports = User;