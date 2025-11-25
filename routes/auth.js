const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { name, email, password, deviceToken } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ error: "User exists" });
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);
   user = new User({ name, email, password: hashedPassword, deviceToken });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
});

router.post('/login', async (req, res) => {
    const {email, password, deviceToken} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Invalid credentials"});
    const match = await user.comparePassword(password);
    if(!match) return res.status(400).json({error: 'Invalid credentials'})

        if(deviceToken) user.deviceToken = deviceToken;
        await user.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.json({token});
})

module.exports = router;
