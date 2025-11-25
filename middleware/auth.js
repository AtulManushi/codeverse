const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({error: "Unauthorize"});

    const token = authHeader.split(" ")[1];
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      
      if(!user) return res.status(401).json({error: "Unauthorize"});
      req.user = user;
      next();
    }catch(error){
     return res.status(401).json({error: 'Invalid token'});
    }
};

module.exports = authMiddleware;