const statusCodes = require('../statusCodes')
const CustomAPIError = require('./custom-api')

class UnauthorizedError extends CustomAPIError {
	constructor(message) {
		super(message)
		this.statusCode = statusCodes.UNAUTHORIZED
	}
}

module.exports = UnauthorizedError
