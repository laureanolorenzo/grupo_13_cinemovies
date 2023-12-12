let users = [{'username':'test_user', 'password':'test_password'}];


const loginController = {
    loginView(req,res) {
        res.render('login',{'errormsg':''})
    },
    postLoginData(req,res) {
        // console.log(req.body.usuario);
        let username = req.body.usuario;
        let password = req.body.contraseña;
        let user = users.filter((u) => u.username === username)[0];
        if (user && user['password'] == password) {
            res.redirect('home');
        } else {
            res.render('login',{'errormsg':'Los datos no son correctos'})
        }
            
    }
}
module.exports = loginController;