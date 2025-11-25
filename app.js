const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/chatroom', require('./routes/chatroom'));
app.use('/messages', require('./routes/messages'));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Database connected'))
.catch(err => console.log(err))

module.exports = app;