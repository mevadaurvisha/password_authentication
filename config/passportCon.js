const passportCon = require('passport');
const LocalStrategy = require('passport-local');
const signUpModel = require('../models/signUp/signup-model');
const bcrypt = require('bcrypt');

passportCon.use(new LocalStrategy({usernameField : "email"}, async (email, password, done) => {

        let user = await signUpModel.findOne({ email: email });

        console.log('user>>>',user);
        

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.log('Err---');
                    
                    done(null, err);
                }

                if (result) {
                    console.log('login sucessfully');
                    
                    
                    done(null , user);
                } else {
                    done(null, false);
                }
            });
        } else {
            console.log('no user found');
            
            done(null, false);
        }
        
    }
  ));

passportCon.serializeUser((user, done) => {
    done(null, user._id);
});
  
passportCon.deserializeUser(async (id, done) => {
    const user = await signUpModel.findById(id);
    if(user){
        done(null, user);
    }
});

module.exports = passportCon;