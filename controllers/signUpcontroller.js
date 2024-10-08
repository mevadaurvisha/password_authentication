const signUpModel = require('../models/signUp/signup-model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const signUpController = async (req, res) => {
    console.log("req", req.body);
    if(req.body.password === req.body.con_pass){

        bcrypt.hash(req.body.password, saltRounds,async (err, hashPassword) => {
            console.log("hash",hashPassword);
      
            const data =  {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            }

            try{
                let model = new signUpModel(data);
                console.log("db",model);
                
                await model.save();
                res.redirect('/login')

            }catch(err){
                console.log("err");
                res.redirect('/login')
                
            }
        });
    }else{
        res.redirect('/')
    }
}
const signUpForm = (req, res) => {
    res.render('./pages/samples/register');
}

module.exports = {signUpForm,signUpController};