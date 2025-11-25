const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room:{type: mongoose.Schema.Types.ObjectId, ref:'ChatRoom'},
    sender:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    receiver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    content:{type:String, require:true},
    read:{type:Boolean, default:false}
}, {timestamps:true});

module.exports = mongoose.model('Message', messageSchema);