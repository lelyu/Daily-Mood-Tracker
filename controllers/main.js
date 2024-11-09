const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
	// console.log('------>', req.body)
	const { email, name, password } = req.body

	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists')
	}
	const user = await User.create({ name, email, password })
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ msg: 'created', user: tokenUser })
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new CustomError.BadRequestError(
			'Please provide email and password'
		)
	}
	const user = await User.findOne({ email })
	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid credentials')
	}
	const isPasswordCorrect = await user.matchPassword(password)

	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError('Invalid credentials')
	}

	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ msg: 'logged in', user: tokenUser })
}

const logout = async (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now() + 1000),
	})
	res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}

const dashboard = async (req, res) => {
	res.json({ message: 'Welcome to dashboard' })
}

// check if user is logged in
const isLoggedIn = async (req, res) => {
	const user = req.user
	res.status(StatusCodes.OK).json({ user, isLoggedIn: !!user })
}

module.exports = { register, login, dashboard, logout, isLoggedIn }
