const express = require('express')
const router = express.Router()
const {
	login,
	dashboard,
	register,
	logout,
	isLoggedIn,
} = require('../controllers/main')
const authMiddleware = require('../middleware/auth')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').post(authMiddleware, logout)
router.route('/dashboard').get(authMiddleware, dashboard)
router.route('/isLoggedIn').get(authMiddleware, isLoggedIn)
module.exports = router
