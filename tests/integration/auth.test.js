const request = require('supertest')
const { User } = require('../../models/user')                                                                                                                                                                                                          


describe('auth middleware', () => {
    const server = require('../../index')
    let token
    const exec = () => { 
        return request(server)
        .post('/api/auth')
        .set('x-auth-token', token)
    }

    beforeEach(() => {
        token = new User().generateAuthToken()
    })

    afterEach(async () => {
        await server.close()
    })
    
    // it ("should return an error if there is no token", async () => {
    //     token = ''
    //     const res = await exec()
    //     expect(res.status).toBe(401)
    // })

    it ("should return a bad request when the token is invalid", async () => {
        token = 'promise'
        const res = await exec()
        expect(res.status).toBe(400)
    })

    // it ("should return a valid response object", async () => {
    //     const res = await exec()
    //     expect(res.status).toBe(200)
    // })
})

