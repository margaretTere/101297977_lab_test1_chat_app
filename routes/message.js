const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');


router.get('/room/:room', messageController.getMessagesForRoom);


router.get('/private/:fromUser/:toUser', messageController.getPrivateMessages);

module.exports = router;
