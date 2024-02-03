const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname,'../datos/users.json');

const User = require('../../models/User');
const session = require('express-session');
const cookie = require('cookie-parser');

const {validationResult} = require('express-validator');
function checkPasswordValidity(pw) { //Donde va esto?? En un archivo aparte??
    let [upper,lower,digit,alpha] = [false,false,false,false];
    let forbiddenChars = ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '=',':','.'];
    const re = new RegExp('^[a-zA-Z]$');
    try {
        for (const char of pw.split('')) {
            if (char.toUpperCase() === char) {
                upper = true;
            }
            if (char.toLowerCase() === char) {
                lower = true;
            } 
            if (!isNaN(parseInt(char))) {
                digit = true;
            }
            if (forbiddenChars.includes(char)) {
                return false;
            }
            if (re.test(char)) {
                alpha = true;
            }
        }
    } catch(e) {
        return false // No retorno el error porque queremos que vaya al usuario
    }
    return (upper && lower && digit && alpha);
}
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
        let emailInDB = User.findByField('email', req.body.email);
        let userInDB = User.findByField('user',req.body.user);
        let errors = validationResult(req).mapped();
        if (emailInDB) { //Case mejor?? O directamente una funcion que reciba un booleano
            if (Object.keys(errors).length != 0) {
                errors['email'] = {msg:'*El email ya está en uso'}
            } else {
                errors = {email:{msg:'*El email ya está en uso'}};
            }
        }
        if (userInDB) {
            if (Object.keys(errors).length != 0) {
                errors['user'] = {msg:'*El nombre de usuario no está disponible'};
            } else {
                errors = {user:{msg:'*El nombre de usuario no está disponible'}};
            }
        }
        if (req.body.password != req.body.passwordRepeat) { // Hay mejores formas de hacer esto???
            if (Object.keys(errors).length == 0) { //si el email ya está registrado te recarga la pagina y no te crea el usuario, 
                errors = {password:{msg:'*Las contraseñas deben coincidir'}}
            } else {
                errors['password'] = errors.password ? errors.password : {msg: '*Las contraseñas deben coincidir'};
            }
        }
        if (!checkPasswordValidity(req.body.password)) {
            errors['password'] = errors?.password? errors.password : {msg:'*La contraseña debe contener al menos una letra minúscula, una letra mayúscula, y un número, y sólo puede contener caracteres alfanuméricos'};
        }
        // If final por si hay errores o no
        if (Object.keys(errors).length > 0) { // Un solo check al final
            if (errors.password && errors.passwordRepeat) {
                delete errors.passwordRepeat
            }
            return res.render('registro',{
                errors,
                oldData: req.body,
                user: req.session.userLoggedIn
            })
        } else {

            User.create(req.body);
            res.redirect('home');
        }

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

        let userToLogin = User.findByField(['email','user'], req.body.email)
        let errors = validationResult(req).mapped();
        // return res.send(req.session)
        if (userToLogin) {
            let passwordCompared = bcrypt.compareSync(req.body.password, userToLogin.password);
            if (passwordCompared) {
                delete userToLogin.password
                delete userToLogin.passwordRepeat
                if (req.body.recordame) {
                    const expirationDate = new Date('10 Jan 2025 00:00:00 PDT'); // Luego hacer dinamico
                    req.session.cookie.expires = expirationDate;
                } else {
                    req.session.cookie.expires = false;
                }
                //    delete req.session.cookie.maxAge;  // Si borro toda la cookie me tira error de lectura de originalMaxAge
                    // req.session.cookie.expires = false; 
                    // req.session.cookie.maxAge = -1;
               // }
                // console.log(req.session.cookie.maxAge);
                req.session.userLoggedIn = userToLogin; 
                return res.redirect('/home')
            } else {
                if (Object.keys(errors).length == 0) { //Si no esta vacio, queremos que tomen prioridad los otros errores!
                    errors['password'] = {msg: '*Usuario o contraseña incorrectos'};
                }
        }} else {
            if (Object.keys(errors).length == 0) {
            errors['password'] = {msg: '*Usuario o contraseña incorrectos'};
                }} 
        let {email,password} = req.body;
        return res.render('login', {errors: errors,oldData: {email,password}});
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