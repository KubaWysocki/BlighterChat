const express = require('express')

const usersSetController = require('../controllers/usersSet')

const router = express.Router()

router.get('/users/:page', usersSetController.getUsers)

router.get('/friends/:page', usersSetController.getFriends)

router.get('/friend-requests', usersSetController.getFriendRequests)

module.exports = router