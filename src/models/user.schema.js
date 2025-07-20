const mongoose = require('mongoose');


// user Schema and Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: function(){
            return !this.googleId;
        },
        minlength: 6
    },
    googleId:{
        type: String,
    },

    provider:{
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },

    avatar:{
        type: String
    },


    isAdmin: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
       
    },
    emailToken:{
        type : String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String
    },
    otpVerified:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false

});

const User = mongoose.model('User', userSchema);
module.exports = User;