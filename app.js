require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const mainRoute = require('./routes/main')
const moodRoute = require('./routes/moodRoutes')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')

// security features
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const { allow } = require('joi')
const allowedOrigins = [
	'http://localhost:3001', // Local dev origin
	'https://mood-tracker-frontend-g3z7k927f-lelyus-projects.vercel.app', // Vercel deployment
	'https://mood-tracker-frontend-9h425oqmo-lelyus-projects.vercel.app', // Vercel deployment
]
app.set('trust proxy', 1)
// app.use(
// 	rateLimiter({
// 		windowMs: 15 * 60 * 1000, // 15 minutes
// 		max: 100,
// 	})
// )

app.use(helmet())
app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin || // Allow non-browser clients (e.g., Postman, curl)
				allowedOrigins.includes(origin) || // Allow specific origins
				/^https:\/\/mood-tracker-frontend-[\w-]+\.lelyus-projects\.vercel\.app$/.test(
					origin
				) // Allow all Vercel subdomains
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
app.use(express.static('./public'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1', mainRoute)
app.use('/api/v1/mood', moodRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL)
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
