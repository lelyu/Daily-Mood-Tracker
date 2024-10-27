const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api')

class UnauthorizedError extends CustomAPIError {
	constructor(message) {
		super(message)
		this.statusCode = statusCodes.UNAUTHORIZED
	}
}

module.exports = UnauthorizedError
