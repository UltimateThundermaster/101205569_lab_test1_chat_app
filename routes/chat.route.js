const express = require('express')
const { chatController } = require('../controller')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, chatController.dashboard)

router.get('/group', auth, chatController.groupChat)

module.exports = router