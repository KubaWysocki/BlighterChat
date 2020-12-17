const express = require('express')

const usersSetController = require('../controllers/usersSet')

const router = express.Router()

router.get('/users', usersSetController.getUsers)

router.get('/friend-requests', usersSetController.getFriendRequests)

router.get('/friends', usersSetController.getFriends)

module.exports = router