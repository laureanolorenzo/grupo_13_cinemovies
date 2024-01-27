const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();

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

router.get('/usuario', usersController.usersView);

router.post ('/usuario', uploadFile.single('users'), usersController.usersRegister);

router.get('/registro', guestMiddleware, usersController.registerView);

router.post('/registro', usersController.postRegisterData);

// router.get('/login', usersController.loginView);

// router.post('/login', usersController.postLoginData);

router.get('/login', guestMiddleware, usersController.login);

router.post('/login', usersController.loginProcess);

router.get('/perfil', ingresarAPerfilMiddleware, usersController.profile)

router.get('/cerrarSesion', usersController.logout)

module.exports = router;