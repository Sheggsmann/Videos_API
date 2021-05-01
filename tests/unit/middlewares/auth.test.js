const { User } = require('../../../models/user')
const auth = require('../../../middlewares/auth')
const mongoose = require('mongoose')


describe('should populate req.body payload with a valid JWT', () => {
    // We need to learn when to write unit and integration tests, all of them 
    let token

    // Always add, toHexString(), if you want to generate a custom mongodb id
    const user = { 
        _id: mongoose.Types.ObjectId().toHexString(), 
        isAdmin: true 
    }

    token = new User(user).generateAuthToken()     

    // The request property is an object, and the header gets called as a function
    // so, basically, what happens here is, we make the [req] prop an object,
    // which will be able to contain new properties.
    const req = {
        header: jest.fn().mockReturnValue(token)
    }

    // We also make the [res] property an object
    const res = {}

    // We make the next a jest function
    const next = jest.fn()

    auth(req, res, next)

    expect(req.user).toMatchObject(user)
})
