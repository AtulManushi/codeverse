const router = require('express').Router();
const auth = require('../middleware/auth');

router.put('/device-token', auth, async (req, res) => {
    req.user.deviceToken = req.body.deviceToken;
    await req.user.save();
    res.json({success: true});
});

module.exports = router;