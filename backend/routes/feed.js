const express = require('express')
const {param} = require('express-validator')

const resolveValidation = require('../util/resolveValidation')
const feedController = require('../controllers/feed')

const router = express.Router()

router.get(
  '/feed/:page',
  param('page').isNumeric().toInt(),
  resolveValidation,
  feedController.getFeed
)

router.get(
  '/notifications-count',
  feedController.notificationsCount
)

module.exports = router