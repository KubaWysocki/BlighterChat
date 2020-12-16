const express = require('express')

const usersController = require('../controllers/users')

const router = express.Router()

router.get('/profile/:slug', usersController.getProfile)

router.get('/users', usersController.getUsers)

router.put('/send-friend-request', usersController.sendFriendRequest)

module.exports = router