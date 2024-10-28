const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const {
	getMoods,
	createMood,
	updateMood,
	deleteMood,
} = require('../controllers/moodController')

router.route('/').get(authMiddleware, getMoods).post(authMiddleware, createMood)
router
	.route('/:id')
	.patch(authMiddleware, updateMood)
	.delete(authMiddleware, deleteMood)

module.exports = router
