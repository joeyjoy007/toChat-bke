
const { accessChat, fetchUser, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController')
const protect = require('../middleWare/Auth')

const router = require('express').Router()


router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchUser)
router.route('/group').post(protect,createGroupChat)
router.route('/rename').put(protect,renameGroup)
router.route('/groupRemove').put(protect,removeFromGroup)
router.route('/groupAdd').put(protect,addToGroup)


module.exports = router