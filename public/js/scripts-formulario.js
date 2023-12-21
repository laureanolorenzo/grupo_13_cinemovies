const inputUser = document.getElementById('usuario');
// const password = document.getElementById('contraseña');
const userValue = inputUser.value
if (userValue.length < 3) {
    window.alert('Nombre demasiado corto');
}