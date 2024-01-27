const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname,'../datos/users.json');

const User = require('../../models/User');
const session = require('express-session');

const usersController = {
    usersView(req,res) {
        res.render('users', { user: req.session.userLoggedIn }); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },

    usersRegister (req,res){
        return res.send ({
            body: req.body,
            file: req.file
        })
    },

    registerView(req,res) {
        res.render('registro', { user: req.session.userLoggedIn })
    },

    postRegisterData(req,res) {
        let userInDB = User.findByField('email', req.body.email);
        if (userInDB) {
            return res.render('registro', {  //si el email ya está registrado te recarga la pagina y no te crea el usuario, falta hacer que se vean los mensajes de error
                errors: {
                    email: {
                        msg: 'Este email ya está registrado'
                    }
                },
                oldData: req.body,
                user: req.session.userLoggedIn 
            })
        }
        User.create(req.body);
        res.redirect('home');

        // let usersString = fs.readFileSync(usersPath,{encoding:'utf-8'});
        // let users = JSON.parse(usersString);
        // let user = {};
        // user.username = req.body.user;
        // user.email = req.body.email;
        // user.password = bcrypt.hashSync(req.body.password);
        // user.passwordRepeat = bcrypt.hashSync(req.body.passwordRepeat);
        // user.id = 1;
        // console.log(users);
        // let lastUser = users.pop(); //saca el ultimo valor ingresado para despues usar su id
        // if (!users || users.length==0){
        //     users = [];
        // } else {
        //     user.id = lastUser.id + 1; //saca un nuevo numero de id sumandole 1 al id del valor que sacamos antes
        // }
        // users.push(lastUser); //devuelve el lastUser al archivo
        // users.push(user);   //agrega el nuevo usuario al archivo
        // usersToSave = JSON.stringify(users, null, " ");
        // fs.writeFileSync(usersPath,usersToSave,{encoding: 'utf-8'})
        // res.redirect('home')
    },



    // loginView(req,res) {
    //     let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
    //     let users = JSON.parse(usersString);
    //     res.render('login',{'errormsg':''});
    // },

    // postLoginData(req,res) {
    //     let usersString = fs.readFileSync(path.join(__dirname,'../datos/users.json'),{encoding:'utf-8'});
    //     let users = JSON.parse(usersString);
    //     const username = req.body.user;
    //     const password = req.body.password;
    //     let user = users.find((u) => u.username === username);
    //     if (user && user['password'] !== password) {
    //         res.render('login',{'errormsg':'La contraseña es incorrecta'});
    //     } else if (!(user)) {
    //         res.render('login',{'errormsg':'No se ha encontrado al usuario'});
            
    //     } else if (user && user['password'] === password) {

    //         req.session.idUsuario = user.id;

    //         res.redirect('home');
    //     }
        
    // },


    login: (req,res) => {
        return res.render('login', {user: req.session.userLoggedIn} );
    },

    loginProcess: (req,res) => {

        let userToLogin = User.findByField('email', req.body.email)

        if (userToLogin){

            let passwordCompared = bcrypt.compareSync(req.body.password, userToLogin.password)

            if (passwordCompared) {
                // return res.render('home',{categs:categs})
                delete userToLogin.password
                delete userToLogin.passwordRepeat
                req.session.userLoggedIn = userToLogin;
                return res.redirect('/home')
            }

            res.render('login',{errors: {
                password: {
                    msg: 'Contraseña incorrecta'
                }}, 
                user: req.session.userLoggedIn 
            });
        }

        return res.render('login', {user: req.session.userLoggedIn, errors: {
            email: {
                msg: 'Email no encontrado'
            }
        }});
    },

    profile: (req,res) => {
        return res.render('perfilUsuario', { user: req.session.userLoggedIn });
    },

    logout: (req,res) => {
        req.session.destroy();
        res.redirect('home')
    }
}

module.exports = usersController;