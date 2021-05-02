// Test Driven Development
/*
This is a type of development method, that encourages the test first method to the
code first method.
By this approach, they are alot of Pros and Cons

PROS
====
1. It helps you to plan the project better
2. It helps to reduce the complexity of the solution since we focus on making the test 
   to be passed.
3. It promotes more confident refactoring.

CONS
====
1. It can easily get complicated or overwhelming, thereby causing delay in production.

Using this approach, we try to create the tests to be passed by the functionality
before ever actually writing the code.
*/

const request = require('supertest')
const mongoose = require('mongoose')
const moment = require('moment')
const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movies')


// The TDD stage => we begin to plan the project structure, the tests to write
// We need a movieId and customerId

// === Negative Cases ===
// Return 401 error if the user is not logged in
// Return 400 error if there is no movieId or customerId
// Return 404 error if the rental is not found in the database.
// Return 400 if the rental is already processed.

// === Positive Cases === 
// Return 200 if it is a valid request
// Set the return date
// Calculate the rental fee (numberOfDays * movies.dailyRentalFee)
// Increase the stock
// return the rental summary


describe('/api/returns', () => {
    let server
    let token
    let customerId
    let movieId
    let movie
    let rental

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../index')
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()

        movie = new Movie({
            _id: movieId,
            title: "Now you see me, Now you don't",
            genre: { name: "Horror" },
            numberInStock: 10,
            dailyRentalRate: 2
        })

        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: "Now you see me, Now you don't",
                dailyRentalRate: 2
            }
        })

        await rental.save()
        token = new User().generateAuthToken()
    })

    afterEach(async () => {
        await server.close() // Closing the server returns a Promise
        await Rental.remove({})
    })

    it ("should return 401 error if the user is not logged in.", async () => {
        token = ''
        const res = await request(server)
            .post('/api/returns')
            .send({ customerId, movieId })
        expect(res.status).toBe(401)
    })

    it ("should return the movies genre", async () => {
        const result = await Rental.findById(rental._id)
        expect(result).not.toBeNull()
    })

    it ("should return a 400 error if no customerId is provided", async () => {
        customerId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it ("should return a 400 error if no movieId is provided", async () => {
        movieId = ''
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it ("should return a 404 error if the rental is not found in the database", async () => {
        await Rental.remove({})
        const res = await exec()
        expect(res.status).toBe(404)
    })
 
    it ("should return 400 if the rental has been processed", async () => {
        rental.dateReturned = new Date()
        await rental.save()
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it ("should return 200 if the rental is processed successfully", async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })

    it ("should return the rental price if the rental is processed", async () => {
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    it ("should return the daily rental fee if the input is valid", async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()        
        await rental.save()
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBeDefined()
    })

    it ("should return the stock if the input is valid", async () => {
        const res = await exec()
        const movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })

    it ("should return the rental summary if input is valid", async () => {
        const res = await exec()
        const rentalInDb = await Rental.findOne({ _id: rental._id })
        /* One way to compare it is to check all the properties manually    

            expect(res.body).toHaveProperty('movie.title', movie.title)
            expect(res.body).toHaveProperty('dateOut', yourCustomDateOut)
        */

        // Here is the other way to do it.
        /*
            We check if the keys in the response body has all the properties in the
            array below.        
        */
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        )
            
    })
})


