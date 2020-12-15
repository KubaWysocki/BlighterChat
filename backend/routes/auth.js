const express = require('express')

const isAuth = require('../middleware/isAuth')
const authController = require('../controllers/auth')

const router = express.Router()

router.put('/new-user', authController.signup)

router.post('/login', authController.login)

router.get('/auto-login', isAuth, authController.autoLogin)

module.exports = router