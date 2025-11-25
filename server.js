const http = require('http');
const app = require('./app');
const jwt = require('jsonwebtoken');
const User = require('./models/User')

const server = http.createServer(app);
const io = require('socket.io')(server, {cors:{origin:'*'}});

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
  try{
   
    const decoded = jwt.verify(token.process.env.JWT_SECRET);
    const uset = await User.findById(decoded.id);
    if(!user) return next(new Error('Unauthorized'));
    socket.user = user;
    next()
  }catch(err){
   next(new Error('Unauthorized'))
  }
});

io.on('connection', socket => {
    const userId = socket.user._id.toString();
    socket.join(userId);
    socket.user.online = true;
    socket.user.save();
    socket.on('disconnect', async()=> {
        socket.user.online = false;
        await socket.user.save();
    })
});

app.set('io', io);

server.listen(process.env.PORT || 4000, () => console.log('server is running'))
