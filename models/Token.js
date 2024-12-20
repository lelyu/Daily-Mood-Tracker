const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600, // expire in 5 minutes
	},
})
module.exports = mongoose.model('Token', tokenSchema)
