const moment = require('moment')
const Joi = require('joi')
const mongoose = require('mongoose')

// The rental model

// For validating Object Ids, we use the joi-objectid module,
// npm i joi-objectid

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            }
        }),
        required: true
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0
            },
        }),
        required: true
    },
    
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: {
        type: Date
    },

    rentalFee: {
        type: Number,
        min: 0
    }
})


// INFORMATION EXPRERT PRINCIPLE OF OOP.
// All functions that manipulate data which is contained in a class should be in the class,
// as either an instance or static method.

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date()
    
    const rentalDays = moment().diff(this.dateOut, 'days')
    this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', rentalSchema)


function validateRental(rental) {
    const schema = Joi.object({
        // We are now using the objectId which we added to the Joi package manually.
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    })
    return schema.validate(rental)
}



module.exports.Rental = Rental
module.exports.validate = validateRental