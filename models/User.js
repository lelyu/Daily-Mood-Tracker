const mongoose = require('mongoose')
const bcrypt = require('bcryptjs/dist/bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a username'],
		minlength: 3,
		maxlength: 50,
		unique: true,
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 6,
		maxlength: 100,
		// select: false,
	},
})

UserSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

UserSchema.methods.getName = function () {
	return this.name
}

UserSchema.methods.createJWT = async function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	})
}

UserSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
