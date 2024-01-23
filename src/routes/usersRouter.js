const usersController = require('../controllers/usersController');
const express = require('express');
const router = express.Router();

const path = require ('path');
const multer = require ('multer');

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


module.exports = router;