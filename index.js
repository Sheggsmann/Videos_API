const helmet = require('helmet')
const compression = require('compression')
const express = require('express')
const app = express()


require('./startup/logging')()
require('./startup/db')()
require('./startup/route')(app)
require('./startup/config')()
require('./startup/validation')()

// For securing our application
app.use(helmet())

// For compressing our http requests.
app.use(compression())


const port = process.env.PORT || 8700


// The app.listen function returns an object that can be assigned to a variable.
const server = app.listen(port, () => {
    console.log(`[SERVER RUNNING ON PORT ${port}]`)
})

module.exports = server