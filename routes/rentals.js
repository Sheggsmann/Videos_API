const auth = require('../middlewares/auth')
const validateMiddleware = require('../middlewares/validate')
const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movies')
const { Customer } = require('../models/customer')
const Fawn = require('fawn')
const mongoose = require('mongoose')
const express = require('express')

const router = express.Router()

// Fawn is the module used to perform transaction in mongodb.
// Initialize the fawn module to work with mongoose.
Fawn.init(mongoose)


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
})


router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send("Could not find Customer")

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send("Could not find movie")

    // Check if the movie is still remaining.
    if (movie.numberInStock === 0) return res.status(400).send("Movie out of stock")

    let rental = new Rental({
        customer: {
            // Here, we are holding the id of the customer for futher querying.
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            // Here we are holding the id of the movie for furhter querying.
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    })

    /*
    There is a problem addressed here, a situation whereby our server crashes, or
    rental returns an error during operation, the movie in stock will not be updated
    thereby leading to in-cosistent data.

    This is where [TRANSACTIONS] come in.
    Transactions ensure that all the operations are completed, or all of them are exited
    once the first one returns an error.

    We don't really have transactions in mongodb, but we can use an npm module to simulate
    this. (Another technique is the "Two Factor Commit Method.")
    */

    // rental = await rental.save()
    
    // movie.numberInStock--;
    // await movie.save()

    // res.send(rental)

    // Using Transactions
    // Create a new transaction.
    const task = Fawn.Task()
    
    task
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
        // .remove('genres', { name: "Adventure" })
        // The database is not updated unless, .run is called. 
        .run()
        .then(results => {
            res.send(rental)    
        })
        .catch(err => {
            // Everything is rolled back here.
            console.log(err.message)
            res.status(500).send("An Error Occurred.")
        })

})


module.exports = router