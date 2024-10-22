const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
	console.log('header', req.headers)
	const authHeader = req.headers.authorization

	// Check if the Authorization header exists
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	// Extract the token from the Bearer header
	const token = authHeader.split(' ')[1] // Split and get the token part

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized' })
	}
}

module.exports = authMiddleware
