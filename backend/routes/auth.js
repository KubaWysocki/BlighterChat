const express = require('express')

const authController = require('../controllers/auth')

const router = express.Router()

router.put('/new-user', authController.signup)

router.post('/login', authController.login)

module.exports = router