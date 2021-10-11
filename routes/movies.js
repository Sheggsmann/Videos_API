const asyncMiddleware = require('../middlewares/async')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const { Movie, validate } = require('../models/movies')
const { Genre } = require('../models/genre')
const express = require('express')
const router = express.Router()


router.get('/', asyncMiddleware(async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
}))


router.get('/:id', asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById(req.params.id).select("-__v")
    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
}))


router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(422).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send("Invalid Genre")

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    movie = await movie.save()
    res.send(movie) 
}))


router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(422).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send("Invalid Genre")

    let movie = await Movie.updateOne({ _id: req.params.id }, {
        $set: {
            "title": req.body.title,
            "genre": {
                "_id": genre._id,
                "name": genre.name
            },
            "numberInStock": req.body.numberInStock,
            "dailyRentalRate": req.body.dailyRentalRate
        }
    }, { new: true })
    
    res.send(movie)
}))



router.delete('/:id', auth, asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send("The movie with the given ID was not found")
    res.send(movie)
}))



module.exports = router





