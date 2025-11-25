const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require("../models/User");
const fcm = require('../utils/fcm');

router.post('/', auth, async (req, res) => {
    const {roomId, content} = req.body;
    const room = await ChatRoom.findById(roomId);
    if(!room) return res.status(404).json({error:"Room not found"});
    const receiverId = room.members.find(m => m.toString() !== req.user._id.toString())
    const message = await Message.create({room:roomId, sender:req.user._id, receiver:receiverId, content});
    req.app.get('io').to(receiverId.toString()).emit('message:new', message);
    const receiver = await User.findById(receiverId);
    if(!receiver.online && receiver.deviceToken) fcm.sendPush(receiver.deviceToken, req.user.name, content);
    res.json(message);
});

router.get('/:roomId', auth, async (req, res)=> {
    const messages = (await Message.find({room:req.params.roomId})).sort({createdAt:1});
    res.json(messages);
})

router.patch("/read", auth, async (req, res) => {
    await Message.updateMany({room: req.body.roomId, receiver:req.user._id, read:false}, {read:true})
    res.json({success:true});
})

module.exports = router;