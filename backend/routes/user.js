const express = require('express')

const userController = require('../controllers/user')

const router = express.Router()

router.get('/profile/:slug', userController.getProfile)

router.put('/send-friend-request', userController.sendFriendRequest)

router.get('/friend-requests-number', userController.getNewFriendRequestsNumber)

router.delete('/reject-friend-request/:slug', userController.rejectFriendRequest)

router.put('/add-friend', userController.addFriend)

router.delete('/remove-friend/:slug', userController.removeFriend)

module.exports = router