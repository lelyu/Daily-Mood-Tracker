const mongoose = require('mongoose')
const MoodSchema = new mongoose.Schema({
	mood: {
		type: String,
		enum: ['happy', 'sad', 'angry', 'stressed', 'relaxed'],
		required: [true, 'Please provide a mood'],
		default: 'happy',
	},
	intensity: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, 'Please provide an intensity'],
	},
	note: {
		type: String,
		maxlength: 100,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
})

module.exports = mongoose.model('Mood', MoodSchema)
