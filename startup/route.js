const express = require('express')
const cors = require('cors')
const error = require('../middlewares/error')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const returns = require('../routes/returns')


module.exports = function(app) {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/genres', genres)
    app.use('/api/customers', customers)
    app.use('/api/movies', movies)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use('/api/returns', returns)

    // While logging errors, we put the error handler at the bottom of all the routes
    // Error will always be the next middleware function because we have been dealing
    // with /api/something.
    app.use(error)
}
