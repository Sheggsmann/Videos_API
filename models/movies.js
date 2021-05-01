const Joi = require('joi')
const mongoose = require('mongoose')
const { genreSchema } = require('./genre')


const moviesSchema = new mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number
})

const Movie = mongoose.model('Movie', moviesSchema)

function validateMovie(movie) {
    const schema = Joi.object({
        genreId: Joi.objectId().required(),
        title: Joi.string().min(1).max(255).required(),
        numberInStock: Joi.number().integer().positive().max(255),
        dailyRentalRate: Joi.number().integer().positive().max(255)
    })
    return schema.validate(movie)
}


module.exports.Movie = Movie
module.exports.validate = validateMovie