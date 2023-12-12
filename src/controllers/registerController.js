const registerController = {
    registerView(req,res) {
        res.render('registro')
    },
    postRegisterData(req,res) {
        res.redirect('home')
    }
}
module.exports = registerController;