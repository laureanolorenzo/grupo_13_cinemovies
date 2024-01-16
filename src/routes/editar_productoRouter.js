const path = require ('path')
const express = require('express');
const router = express.Router();
const detalle_productoController = require('../controllers/detalle_productoController');

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

router.get('/editar_producto/:id', detalle_productoController.editar_productoView);

router.put('/editar_producto/:id', multipleUpload ,detalle_productoController.editar_producto);

module.exports = router;
