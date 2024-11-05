const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
	console.log('cookies ------>', req.cookies)
	const token = req.cookies.token || req.signedCookies.token
	console.log('------>', token)
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
