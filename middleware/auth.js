const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
	const token = req.cookies.token || req.signedCookies.token
	console.log('token from authMiddleware', token)
	if (!token) {
		throw new CustomError.UnauthenticatedError('Authentication invalid')
	}
	try {
		const { name, userId } = isTokenValid({ token })
		req.user = { name, userId }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Authentication invalid')
	}
}

module.exports = authMiddleware
