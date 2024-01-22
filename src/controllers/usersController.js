const usersController = {
    usersView(req,res) {
        res.render('users'); // Incluir objeto (que venga de JSON con los datos de cada producto)
    }
}

module.exports = usersController;