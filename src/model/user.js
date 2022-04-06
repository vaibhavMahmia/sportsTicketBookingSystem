var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    }
});

module.exports = mongoose.model('User', user);