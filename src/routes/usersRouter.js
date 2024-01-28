const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const path = require ('path');
const multer = require ('multer');

const guestMiddleware = require('../middlewares/guestMiddleware');
const ingresarAPerfilMiddleware = require('../middlewares/ingresarAPerfilMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb (null,'./public/images/users');
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
})

const uploadFile = multer({storage});

const userValidations = [
    body('email').notEmpty().withMessage('*Por favor escriba su correo electrónico').isLength({min: 5, max: 40}).withMessage('*Email inválido'),
    body('user').notEmpty().withMessage('*Por favor escriba su nombre de usuario').isLength({min:3, max:40}).withMessage('El usuario debe tener 3 a 40 caracteres'),
    body('password').notEmpty().withMessage('*Por favor escriba una contraseña').isLength({min:3, max:40}).withMessage('La contraseña debe tener 3 a 40 caracteres'),
    body('passwordRepeat').notEmpty().withMessage('*Por favor repita su contraseña')
]
const userLoginValidations = [
    body('email').notEmpty().withMessage('*Por favor escriba su usuario o correo electrónico'),
    body('password').notEmpty().withMessage('*Debe escribir su contraseña')
]
// Metodos

router.get('/usuario', usersController.usersView);

router.post ('/usuario', uploadFile.single('users'), usersController.usersRegister);

router.get('/registro', guestMiddleware, usersController.registerView);

router.post('/registro',userValidations, usersController.postRegisterData);

// router.get('/login', usersController.loginView);

// router.post('/login', usersController.postLoginData);

router.get('/login', guestMiddleware, usersController.login);

router.post('/login',userLoginValidations, usersController.loginProcess);

router.get('/perfil', ingresarAPerfilMiddleware, usersController.profile)

router.get('/cerrarSesion', usersController.logout)

module.exports = router;