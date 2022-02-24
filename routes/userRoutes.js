const { registerUser, authUser, allUser } = require('../controllers/userController')
const protect = require('../middleWare/Auth')

const router = require('express').Router()

router.route('/').post(registerUser).get(protect,allUser)
router.route('/login').post(authUser)

module.exports = router