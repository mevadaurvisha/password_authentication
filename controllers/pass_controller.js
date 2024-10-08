const bcrypt = require('bcrypt');
const signUpModel = require('../models/signUp/signup-model');
const otp_generator  = require('otp-generator');
const nodeMailer = require('nodemailer');
let myOTP = null;
const token_generator = require('token-generator');

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'urvishamevada90@gmail.com',
        pass: 'ropnbfxgjloxkmik',
    },
});


const changePassword = async (req, res) => {
    res.render('./pages/samples/change-password');
}

const updatePassword = (req,res) => {
    console.log('update...');
    
    const {password} = req.user;
    const {curr_pass, new_pass, con_pass} = req.body;
    
    bcrypt.compare(curr_pass, password, (err, result) => {
        console.log('result',result,err);
        console.log('password',password);
        
        if(result){
            if(new_pass === con_pass){
                console.log('newpass == conpass');
                
                bcrypt.hash(new_pass, 10, async (err, hashPassword) => {
                    console.log('hashPassword',hashPassword);
                    
                    const updatedPassword = await signUpModel.updateOne({_id : req.user._id} , {password: hashPassword});
                    console.log('updatedPassword',updatedPassword);
                    
                })
                res.redirect('/login');
            }
            else{
                console.log('new!=con');
                res.redirect('/change-password');
            }
            
        }
        else{
            console.log('password not matched');
            res.redirect('/change-password');
        }
    })
}


const forgot = (req, res) => {
    res.render('./pages/samples/forgot-password');
}

const confirmUser = async (req, res) => {
    const {username} = req.body;

    const user = await signUpModel.findOne({email: username});
    if(user){
        console.log('user found',user);

        
        const tokenGenerator = new token_generator({
            salt: 'some-salt',
            timestamp: true,
            timestampMap: '0123456789'
        });
        let token = tokenGenerator.generate();
        
        // const token_generator = new token_generator({
        //     salt: 'some-salt',
        //     timestamp: true
        // });
        await signUpModel.updateOne({_id : user._id} , {resetToken: token});

        let link = `http://localhost:3007/reset/${user._id}`;
        console.log('link-------',link);


        let mailopt = {
            from: 'urvishamevada90@gmail',
            to: user.email,
            subject: 'Reset Password',
            text: `Otp : <a href=${link}></a>`,
        };  
        transporter.sendMail(mailopt, (err, info) => {
            if(err){
                console.log('err',err);
                
            }else{
                console.log('email sent',info);
                
            }
        })
        res.redirect(`/forgot`);

    }else{
        res.redirect('/signup');
    }

}
const otp = (req, res) => {

    // let otp = otp_generator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});

    // myOTP = otp;

    // console.log('myOTP',myOTP);
    

    // res.render('./pages/samples/ConOTP', {id:req.params.id});

}

const ConfirmOTP = (req, res) => {
    
    const userId = req.params.id;

    res.render('./pages/samples/resetPass' , {id: userId});
}

const resetPass = async (req,res ) => {
    const userId = req.params.id;
    // res.render('pages/samples/resetPass', {id: userId});

    console.log('userId',userId);

    try{
        const user = await signUpModel.findOne({_id : userId});
        console.log('user',user);

        if(user){
            if(user.resetToken){

                await signUpModel.updateOne({ _id: userId }, { resetToken: null });

                res.render('pages/samples/resetPass', {id: userId});
            }
            else{
                console.log('invalid token');
                
                res.redirect('/err');
            }
        }else{
            res.redirect('/err');
        }
    }
    catch(err){
        console.log('err',err);
        
        res.redirect('/err');
    }
    
}

const resetPassword = (req, res) => {

    const id = req.params.id;

    const {new_pass, con_pass} = req.body;
    if(new_pass === con_pass){
        console.log('newpass == conpass');
        
        bcrypt.hash(new_pass, 10, async (err, hashPassword) => {
            console.log('hashPassword',hashPassword);
            
            const updatedPassword = await signUpModel.updateOne({_id : id} , {password: hashPassword});
            console.log('updatedPassword',updatedPassword);
            
        })
        res.redirect('/login');
    }
    else{
        console.log('new!=con');
        res.redirect(`/pages/samples/resetPass/${id}`);
    }

}

const error = (req, res) => {

    res.render('pages/samples/error-404');
}
module.exports = {changePassword, updatePassword, forgot, confirmUser,otp ,ConfirmOTP, resetPass, resetPassword, error}