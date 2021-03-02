const express = require('express')

const feedController = require('../controllers/feed')

const router = express.Router()

router.get('/feed/:page', feedController.getFeed)

router.get('/notifications-count', feedController.notificationsCount)

module.exports = router