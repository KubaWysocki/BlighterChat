const express = require('express')

const feedController = require('../controllers/feed')

const router = express.Router()

router.post('/feed', feedController.getFeed) //post to avoid caching

router.get('/notifications-count', feedController.notificationsCount) //post to avoid caching

module.exports = router