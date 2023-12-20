const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Para poder acceder a la info de post
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// Rutas
const rutaHome = require('./routes/mainRouter');
const rutaLogin = require('./routes/loginRouter');
const rutaRegister = require('./routes/registerRouter');
const rutaCarrito = require('./routes/carritoRouter');
const rutaCategorias = require('./routes/categoriasRouter');
const rutaDetalleProducto = require('./routes/detalle_productoRouter');
const rutaKiosco = require('./routes/kioscoRouter');
const rutaPromociones = require('./routes/promocionesRouter');
const rutaPagar = require('./routes/ir_a_pagarRouter');
const rutaEdicionProducto = require ('./routes/edicion_productoRouter');

// Usos de los routers

app.use(rutaHome);

app.use(rutaLogin);

app.use(rutaRegister);

app.use(rutaCarrito);

app.use(rutaCategorias);

app.use(rutaDetalleProducto);

app.use(rutaKiosco);

app.use(rutaPromociones);

app.use(rutaPagar);

app.use(rutaEdicionProducto);
// Servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

let homePath = path.resolve(__dirname, 'views/home.html');
// app.get('/', (req, res) => res.sendFile(homePath)); //View del home
// app.get('/home', (req, res) => res.sendFile(homePath)); 

// Resto de los archivos. Con esto ya deberían funcionar sin importar el nombre que se les ponga.
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'views'));
// for (const file of htmlFiles) {
//     let fileName;
//     let filePath;
//     fileName = file.split('.')[0];
//     filePath = path.resolve(__dirname, `views/${fileName}.html`);
//     if (fileName !== 'home') {
//         app.get(`/${fileName}`, (req, res) => res.sendFile(filePath));
//     }
// }

// Metodo post para el home (Para que al enviar el formulario login me devuelva al home)
app.post('/',(req,res) => res.sendFile(homePath));
// app.post('/login', (req,res) => res.sendFile(homePath));
app.post('/register', (req,res) => res.sendFile(homePath));