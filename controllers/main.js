const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('./sendEmail')

const register = async (req, res) => {
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

const resetPassword = async (req, res) => {
	const { email } = req.body
	const user = await User.findOne({ email })

	if (!user) {
		throw new Error('User does not exist')
	}
	let token = await Token.findOne({ userId: user._id })
	if (token) {
		await token.deleteOne()
	}
	const resetToken = crypto.randomBytes(32).toString('hex')
	const hash = await bcrypt.hash(resetToken, 10)
	await new Token({
		userId: user._id,
		token: hash,
		createdAt: Date.now(),
	}).save()
	const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`
	sendEmail(user.email)
	return link
}

module.exports = { register, login, dashboard, logout, isLoggedIn }
