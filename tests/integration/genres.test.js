// Supertest module enables you to make requests to your servers
// as if it were in postman.

const request = require('supertest')
const { Genre } = require('../../models/genre')
const { User } = require('../../models/user')

let server
const route = '/api/genres/'
 

describe('/api/genres', () => {
    describe("Get /", () => {
        // Load the server before each request
        beforeEach(() => server = require('../../index'))

        // Close the server after every request.
        afterEach(async () => { 
            await server.close()
            // when testing, perform clean up operation after modifying database
            await Genre.remove({})
        })

        it ("should return the genres from the database", async () => {
            await Genre.create([
                { name: "genre1" },
                { name: "genre2" }
            ])

            // we make the request through this syntax
            const res = await request(server).get(route)
            
            expect(res.status).toBe(200)
            // expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
    })


    describe("Get /id", () => {
        it ("Should return a genre if the id is a valid id", async () => {
            const genre = new Genre({ name: 'genre1' })
            await genre.save()

            const res = await request(server).get(route + genre._id)

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('name', genre.name)
        })

        it ("Should return 404 error if the id is invalid", async () => {
            const res = await request(server).get(route + '1')
            expect(res.status).toBe(404)
        })
    })

    
    describe("Post /", () => {
        // Creating Happy Functions
        let token
        let name

        const exec = () => { 
            return request(server)
            .post(route)
            .set('x-auth-token', token)
            .send({ name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
        })

        it ("Should return an error if the user is not authenticated", async () => {
            name = 'genre4'
            token = ''
            // makes a post request to the server carrying the body of the request in the send method.
            const res = await exec()

            expect(res.status).toBe(401)
        })

        it ("Should return a bad request if name is less than 5 characters", async () => {
            name = '1234'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it ("Should return a bad request if name is > 50 characters", async () => {            
            name = 'p'.repeat(55)
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it ("Should save the genre if the input is valid", async () => {
            name = 'genre1'
            const res = await exec()
            expect(res.body).not.toBeNull()
        })

        it ("Should return the genre after saving", async () => {
            const res = await exec()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        })

    })


    describe('PUT /:id', () => {
        let genre
        let token
        let name

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            token = new User().generateAuthToken()
        })

        const exec = () => {
            return request(server)
            .put(route + genre._id)
            .set('x-auth-token', token)
            .send({ name })
        }

        it ("should return a 400 error if the name is not valid", async () => {
            name = 'p'
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it ("should return the updated genre", async () => {
            name = 'Melody'
            const res = await exec()
            expect(res.body).toHaveProperty('name', 'Melody')
        })
    })


    describe('DELETE /:id', () => {
        let genre
        let token 
        
        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            token = new User().generateAuthToken()
        })

        it ("should return the object if it successfully deletes it", async () => {
            const res = await request(server)
            .delete(route + genre._id)
            .set('x-auth-token', token)

            expect(res.body).toHaveProperty('name', genre.name)
        })
    })

})













