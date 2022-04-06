var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model('User', user);