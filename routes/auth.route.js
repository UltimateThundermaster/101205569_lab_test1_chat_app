const express = require('express')
const { authController } = require('../controller')

const router = express.Router()

router.get('/signup', authController.signupForm)

router.post('/signup', authController.signup)

router.get('/signin', authController.getSigninForm)

router.post('/signin', authController.signin)

module.exports = router