// In express, every error handling middleware is prefixed with the error
// as the first parameter in its function.
const winston = require('winston')

module.exports = function(err, req, res, next) {
    winston.error(err.message, err)
    // Logging levels: error, warn, info, verbose
    res.status(500).send("Something went wrong.")
}