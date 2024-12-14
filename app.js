require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const mainRoute = require('./routes/main')
const moodRoute = require('./routes/moodRoutes')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')

// Security packages
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
const cors = require('cors')
const helmet = require('helmet')

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000']

// Trust proxy for rate limiting or cloud deployments
app.set('trust proxy', 1)

// Security Middleware
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `windowMs`
		message: 'Too many requests from this IP, please try again later.',
	})
)
app.use(helmet())
app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin || // Allow non-browser clients
				allowedOrigins.includes(origin) || // Explicitly allowed origins
				origin.endsWith('.vercel.app') // Allow all Vercel subdomains
			) {
				callback(null, true)
			} else {
				console.error(`Blocked by CORS: ${origin}`)
				callback(new Error('Not allowed by CORS'))
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true, // Allow cookies
	})
)
app.use(xss())

// Serve static files
app.use(express.static('./public'))

// Middleware for parsing JSON and cookies
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Application Routes
app.use('/api/v1', mainRoute)
app.use('/api/v1/mood', moodRoute)

// Not Found and Error Handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Start Server
const port = process.env.PORT || 3000
const start = async () => {
	try {
		// Ensure MongoDB connection string exists
		if (!process.env.MONGO_URL) {
			throw new Error('MONGO_URL is not defined in environment variables')
		}

		// Connect to the database
		await connectDB(process.env.MONGO_URL)

		// Start Express server
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`)
		})
	} catch (error) {
		console.error('Error starting server:', error.message)
		process.exit(1) // Exit the process with failure code
	}
}

start()
