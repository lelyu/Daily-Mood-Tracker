require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const mainRoute = require('./routes/main')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

// middleware
app.use(express.static('./public'))
