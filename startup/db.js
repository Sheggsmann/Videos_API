const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

mongoose.Promise = global.Promise
let mongo_uri = process.env.vidly_db
console.log(mongo_uri)

module.exports = function() { 
    // console.log("[DATABASE]:", database)
    mongoose.connect(mongo_uri, {
        useMongoClient: true
    }).then(() => { 
        winston.info(`Connected to ${mongo_uri}`)
    })
    .catch(err => winston.error(err.message))
}

