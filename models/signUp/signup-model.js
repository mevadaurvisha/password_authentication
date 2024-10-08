const mongoose = require('mongoose');

const signupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true

    },
    password: {
        type: String,
        required: true
    },
    resetToken : {
        type: String
    }
});

const signUpModel = mongoose.model('signup', signupSchema);

module.exports = signUpModel;

