const router = require('express').Router();
const auth = require('../middleware/auth');
const ChatRoom = require('../models/ChatRoom');

router.post('/', auth, async (req, res) => {
    const {otherUserId} = req.body;
    let room = await ChatRoom.findOne({members:{$all:[req.user._id, otherUserId]}})
    if(!room){
        room = new ChatRoom({members:[req.user._id, otherUserId]});
        await room.save();
    }
    res.json(room);
});

router.get('/my', auth, async (req, res) => {
    const room = await ChatRoom.find({members:req.user._id}).populate('members', 'name email')
    res.json(room);
});

module.exports = router;