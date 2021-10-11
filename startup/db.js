const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

let mongo_uri = process.env.vidly_db || config.get('db')

if (!mongo_uri) {
    console.log("[FATAL ERROR]: No database connection string provided.")
    process.exit(1)
}


module.exports = function() { 
    mongoose.connect(mongo_uri, {
        useMongoClient: true
    }).then(() => { 
        console.log("[CONNECTED TO DATABASE]")
        winston.info(`Connected to Database`)
    })
    .catch(err => {
        console.log(err.message)
        winston.error(err.message)
    })
}


