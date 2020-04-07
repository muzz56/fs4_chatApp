var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
    user: String,
    msg: String,
    room:String,
    created: String
})
const Chat = mongoose.model ('Chat', chatSchema, 'Chats');
module.exports = Chat;
