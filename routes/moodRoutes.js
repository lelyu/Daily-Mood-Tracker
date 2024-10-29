const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const {
	getMoods,
	getMood,
	createMood,
	updateMood,
	deleteMood,
} = require('../controllers/moodController')

router.route('/').get(authMiddleware, getMoods).post(authMiddleware, createMood)
router
	.route('/:id')
	.patch(authMiddleware, updateMood)
	.delete(authMiddleware, deleteMood)
	.get(authMiddleware, getMood)

module.exports = router
