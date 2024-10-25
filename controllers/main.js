const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils/jwt')

const register = async (req, res) => {
	const { email, name, password } = req.body
	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists')
	}
	const user = await User.create({ name, email, password })
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ user: tokenUser }, res)
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
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
