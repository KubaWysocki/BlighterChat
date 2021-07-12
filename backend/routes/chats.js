const express = require('express')
const {param, query, body, oneOf} = require('express-validator')

const resolveValidation = require('../util/resolveValidation')
const {chatNameSlugRegex, usernameSlugRegex} = require('../util/validators')
const chatsController = require('../controllers/chats')

const router = express.Router()

router.get(
  '/get-chat/:slug?',
  oneOf([
    [
      query('receiver').matches(usernameSlugRegex).isLength({min: 3, max: 20}),
      param('slug').isEmpty(),
    ],
    [
      query('receiver').isEmpty(),
      param('slug').matches(chatNameSlugRegex).isSlug(),
    ]
  ], 'Invalid chat slug, reciever or both provided'),
  resolveValidation,
  chatsController.getChat
)

router.put(
  '/create-chat',
  oneOf([
    [
      body('chatName').matches(chatNameSlugRegex).isLength({min: 3, max: 20}),
      body('slugs').isArray({min: 2}),
    ],
    [
      body('content').notEmpty().isAlphanumeric(),
      body('slugs').isArray({max: 1}),
    ]
  ], 'Invalid chat creation data'),
  body('slugs.*').matches(usernameSlugRegex).isSlug(),
  resolveValidation,
  chatsController.createChat
)

router.get(
  '/more-messages/:slug/:page',
  param('slug').matches(chatNameSlugRegex).isSlug(),
  param('page').isNumeric().toInt(),
  resolveValidation,
  chatsController.getMoreMessages
)

router.post(
  '/send-message',
  body('chatSlug').matches(chatNameSlugRegex).isSlug(),
  body('content').notEmpty().isAlphanumeric(),
  resolveValidation,
  chatsController.postMessage
)

router.post(
  '/message-read',
  body('_id').isMongoId(),
  resolveValidation,
  chatsController.messageRead
)

module.exports = router