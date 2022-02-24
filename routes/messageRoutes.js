const { sendMessage, AllMessage } = require('../controllers/messageController')
const protect = require('../middleWare/Auth')

const router = require('express').Router()

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,AllMessage)

module.exports = router