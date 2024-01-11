const express = require ('express');
const router = express.Router();
const crear_productoController = require('../controllers/crear_productoController');
const path = require('path');

function removeWhiteSpace(str) {
	let forbiddenChars = ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '=',':','.'];
    strArray = str.split(' ');
    strArrayToCapitalize = strArray.slice(1);
    strArrayToCapitalize = strArrayToCapitalize.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    let newStr = strArray[0].concat(strArrayToCapitalize);
	for (const i of forbiddenChars) {
		newStr = newStr.replace(i,'_');
	}
	return newStr;
}

// Multer 
const multer = require('multer');

// Storage
let multerDiskStorage = multer.diskStorage({ //Se guarda como variable para usarse luego
	filename(req,file,callback) {
		let fileName = removeWhiteSpace(req.body.title) + '-' + Date.now() + path.extname(file.originalname); // Date.now() da un numero unico, y path.extname la extension de la imagen original. Se puede combinar con datos del req, por ejempl
		callback(null,fileName) },
	destination(req,file,callback) {
		let folder = path.join(__dirname,'../../public/images/movies'); // Donde se va a guardar
		callback(null,folder);
    }
})
const fileUpload = multer({storage: multerDiskStorage});

const multipleUpload = fileUpload.fields([{name: 'image', maxCount: 1}, {name: 'banner', maxCount: 1}]);

router.get('/crear_producto', crear_productoController.crear_productoView);

router.post('/crear_producto/process', multipleUpload, crear_productoController.crear_productoProcess);

module.exports = router;