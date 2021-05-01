const { Rental } = require('../models/rental')
const { Movie } = require('../models/movies')
const auth = require('../middlewares/auth')
const Joi = require('joi')
const express = require('express')
const router = express.Router()


router.post('/', auth, async (req, res) => {
    if (!req.body.customerId || !req.body.movieId) return res.status(400).send("No movie or customer Id") 

    // This is replace with the static method added to the rentals object
    // const rental = await Rental.findOne({
    //     // Using this method, string to the left, we can query embedded documents
    //     'customer._id': req.body.customerId,
    //     'movie._id': req.body.movieId
    // })

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send("Rental not found.")
    if (rental.dateReturned) return res.status(400).send("The rental is already processed")

    // Calls the function to calculate the rental Fee.
    rental.return()
    await rental.save()

    await Movie.findByIdAndUpdate(
        { _id: rental.movie._id }, 
        { $inc: { numberInStock: 1 }},
    )
   
    res.send(rental)
})


module.exports = router
