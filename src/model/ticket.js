var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticket = new Schema({
    eventname: {
        type:String,
        required:true,
    },
    date: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    row:{
        type: String,
        required: true
    },
    seatnumber:{
        type: Number,
        required: true
    },
    avalibelity: {
        type: Boolean, 
        default: true
    }
});

module.exports = mongoose.model('Ticket', ticket);