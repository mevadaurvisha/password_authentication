const logOutController = (req, res) => {

    req.logout((err) => {

        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    });

}

module.exports = {logOutController};