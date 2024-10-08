const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const signUp = require('../controllers/signUpcontroller');
const logIn = require('../controllers/logincontroller');
const passport = require('../config/passportCon');
const logOut = require('../controllers/logOutController')
const isAuth = require('../Authentication/isAuthenticate');
const password = require('../controllers/pass_controller');

router.get('/', isAuth, controller.defaultcontroller);
router.get('/signup', signUp.signUpForm);
router.post('/signupForm', signUp.signUpController);
router.get('/login', logIn.loginForm);
router.post('/loginForm', passport.authenticate('local', { failureRedirect: '/login' }), logIn.logincontroller);
router.get('/logout', logOut.logOutController);
router.get('/change-password',isAuth, password.changePassword);
router.post('/updatePassword', password.updatePassword); 
router.get('/forgot' , password.forgot);
router.post('/confirmUser', password.confirmUser);
router.get('/otp/:id', password.otp);
router.post('/ConfirmOTP/:id' , password.ConfirmOTP);
router.get('/reset/:id' , password.resetPass);
// router.post('/reset/:id' , password.resetPass);
router.get('/resetPass/:id' , password.resetPassword);
router.post('/resetPass/:id' , password.resetPassword);

router.get('/err' , password.error);
module.exports = router;