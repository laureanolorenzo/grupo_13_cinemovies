const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.resolve(__dirname,'public')));

app.listen(3000,console.log('Servidor corriendo.'));

let homePath = path.resolve(__dirname,'views/home.html')
app.get('/', (req,res) => res.sendFile(homePath)); //View del home

// Resto de los archivos. Con esto ya deberian andar sin importar el nombre que se les ponga.
const htmlFiles = fs.readdirSync(path.resolve(__dirname,'views'));
for (const file of htmlFiles) {
    let fileName;
    let filePath;
    fileName = file.split('.')[0];
    filePath = path.resolve(__dirname,`views/${fileName}.html`);
    if (fileName !== 'home') {
        app.get(`/${fileName}`,(req,res) => res.sendFile(filePath));
    }
}