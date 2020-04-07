var mongoose = require('mongoose');
//const moment = require('moment');
var EventLog = new mongoose.Schema({
    type: String,
    name:{type:String, default:null},
    socket: String,
    room: String,
    connect: String,
    disconnect: String
});
module.exports = mongoose.model('EventLog', EventLog);