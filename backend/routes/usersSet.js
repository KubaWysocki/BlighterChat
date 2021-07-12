const express = require('express')
const {param, query} = require('express-validator')

const resolveValidation = require('../util/resolveValidation')
const usersSetController = require('../controllers/usersSet')

const router = express.Router()

router.get(
  '/users/:page',
  param('page').isNumeric().toInt(),
  query('search').isAlphanumeric(),
  resolveValidation,
  usersSetController.getUsers
)

router.get(
  '/friends/:page',
  param('page').isNumeric().toInt(),
  query('search').isAlphanumeric(),
  resolveValidation,
  usersSetController.getFriends
)

router.get(
  '/friend-requests',
  usersSetController.getFriendRequests
)

module.exports = router