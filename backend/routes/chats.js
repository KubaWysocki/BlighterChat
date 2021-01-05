const express = require('express')

const chatsController = require('../controllers/chats')

const router = express.Router()

router.get('/get-chat/:slug', chatsController.getChat)

router.put('/create-chat', chatsController.createChat)

router.post('/send-message', chatsController.postMessage)

router.post('/message-read', chatsController.messageRead)

module.exports = router