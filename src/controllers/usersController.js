const usersController = {
    usersView(req,res) {
        res.render('users'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    },
    usersRegister (req,res){
        return res.send ({
            body: req.body,
            file: req.file
        })
    }
}

module.exports = usersController;