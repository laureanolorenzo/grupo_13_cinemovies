const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

let homePath = path.resolve(__dirname, 'views/home.html');
app.get('/', (req, res) => res.sendFile(homePath)); //View del home

// Resto de los archivos. Con esto ya deberían funcionar sin importar el nombre que se les ponga.
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'views'));
for (const file of htmlFiles) {
    let fileName;
    let filePath;
    fileName = file.split('.')[0];
    filePath = path.resolve(__dirname, `views/${fileName}.html`);
    if (fileName !== 'home') {
        app.get(`/${fileName}`, (req, res) => res.sendFile(filePath));
    }
}

// Metodo post para el home (Para que al enviar el formulario login me devuelva al home)
app.post('/',(req,res) => res.sendFile(homePath));