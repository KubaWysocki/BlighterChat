const express = require('express')
const {param, body} = require('express-validator')

const resolveValidation = require('../util/resolveValidation')
const {usernameSlugRegex} = require('../util/validators')
const userController = require('../controllers/user')

const router = express.Router()

router.get(
  '/profile/:slug',
  param('slug').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  userController.getProfile
)

router.put(
  '/send-friend-request',
  body('slug').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  userController.sendFriendRequest
)

router.get(
  '/new-friend-requests-number',
  userController.getNewFriendRequestsNumber
)

router.delete(
  '/reject-friend-request/:slug',
  param('slug').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  userController.rejectFriendRequest
)

router.put(
  '/add-friend',
  body('slug').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  userController.addFriend
)

router.delete(
  '/remove-friend/:slug',
  param('slug').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  userController.removeFriend
)

module.exports = router