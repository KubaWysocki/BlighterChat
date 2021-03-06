const express = require('express')
const {body} = require('express-validator')

const resolveValidation = require('../util/resolveValidation')
const {usernameRegex} = require('../util/validators')
const isAuth = require('../middleware/isAuth')
const authController = require('../controllers/auth')

const router = express.Router()

router.put(
  '/new-user',
  body('username').matches(usernameRegex).isLength({min: 3, max: 20}),
  body('email').isEmail(),
  body('password').isLength({min: 8}),
  resolveValidation,
  authController.signup
)

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({min: 8}),
  resolveValidation,
  authController.login
)

router.get(
  '/auto-login',
  isAuth,
  authController.autoLogin
)

router.post(
  '/logout',
  isAuth,
  authController.logout
)

module.exports = router