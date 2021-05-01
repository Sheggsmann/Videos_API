const winston = require('winston')


/*
We can handle other exceptions on startup not caused by express, by using the 
->
process.on('unhandledException', (err) => {
    console.log(err.message)
    winston.error(err.message, err)
})

Similarly, the solution already implemented below does the same thing.

When handling uncaught Promise rejections, we need to do that manually, 
by using the 
-> 
process.on('unhandledRejection', (err) => {
    console.log(err.message)
    winston.error(err.message, err)
})

A similar approach to this will be throwing the exception, and in this way we are
just passing it to the process.on('unhandledException') to log it to the log file.
*/

// Handling uncaught exceptions

module.exports = function() { 
    winston.exceptions.handle(
        // Logging our errors to the console.
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'logfile.log' })
    )

    // Handling uncaught promise exceptions
    process.on('unhandledRejection', (err) => {
        throw err
    })

    /*
    Using Winston.
    winston.exceptions.handle()

    winston is the module used for logging errors.
    we can log the errors in a file, in the console or in an online
    bucket.
    =================================================================

    winston.add(winston.transports.File, { filename: 'logfile.log' })
    winston.add(winston.transports.MongoDb, {
        db: 'mongodb://localhost/genres',
        level: 'info'
    })
    */

    winston.add(new winston.transports.File({ filename: 'logfile.log' }))
    // winston.add(winston.transports.MongoDB, {
    //     db: 'mongodb://localhost/genres'
    // })
}