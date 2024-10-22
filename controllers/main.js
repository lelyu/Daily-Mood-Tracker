const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })
	const token = user.createJWT()
	res.status(StatusCodes.CREATED).json({ user: user.getName(), token })
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: 'Please provide email and password' })
	}
	const user = await User.findOne({ email })
	const isPasswordCorrect = await user.matchPassword(password)

	if (!user || !isPasswordCorrect) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: 'Invalid credentials' })
	}

	const token = user.createJWT()
	res.status(StatusCodes.OK).json({ user: user.getName(), token })
}

const dashboard = async (req, res) => {
	res.json({ message: 'Welcome to dashboard' })
}

module.exports = { register, login, dashboard }
