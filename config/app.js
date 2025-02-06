const http = require('http');
const express = require('express');
const cors = require('cors');
const userRouter = require('../routes/user');
const chatRouter = require('../routes/chat');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/user', userRouter);
app.use('/chat', chatRouter);

const server = http.createServer(app); 

module.exports = server;