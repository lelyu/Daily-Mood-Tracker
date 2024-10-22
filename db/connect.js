const mongoose = require('mongoose')

const connectDB = (url) => {
	// console.log('inside')
	// console.log(url)
	return mongoose.connect(url).then(() => {
		console.log('Connected to the database')
	})
}

module.exports = connectDB
