const jwt = require('jsonwebtoken')

const login = async (req, res) => {
	const { username, password } = req.body
	if (username === 'admin' && password === 'admin') {
		const token = jwt.sign({ username }, process.env.JWT_SECRET)
		res.json({ token })
	} else {
		res.status(401).json({ message: 'Invalid credentials' })
	}
}

const dashboard = async (req, res) => {
	res.json({ message: 'Welcome to dashboard' })
}

module.exports = { login, dashboard }
