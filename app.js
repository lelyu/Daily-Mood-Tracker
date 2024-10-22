require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const mainRoute = require('./routes/main')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const connectDB = require('./db/connect')

// middleware
app.use(express.static('./public'))
app.use(express.json())
app.use('/api/v1', mainRoute)
// app.use(notFoundMiddleware)
// app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
	try {
		// console.log('outside', process.env.MONGO_URL)
		// console.log(process.env.JWT_LIFETIME)
		await connectDB(process.env.MONGO_URL)
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
