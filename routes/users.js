const auth = require('../middlewares/auth')
const validateMiddleware = require('../middlewares/validate')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const express = require('express')

const router = express.Router()


router.get('/', async (req, res) => {
    // Use negation, to remove properties or to work as reverse of selection.
    const users = await User.find().sort('name').select('name email -_id')
    res.send(users)
})

// Route used for authorization
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    return res.send(user)
})


router.post('/', validateMiddleware(validate), async (req, res) => {

    // Check if we have the use in the database already.
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already exists')

    // We are using lodash to filter out the values we want to use.
    // _.pick in particular.

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    
    // Get a salt from bcrypt
    const salt = await bcrypt.genSalt()
    // Generate the hashed password with the salt to store in database.
    user.password = await bcrypt.hash(req.body.password, salt)

    await user.save()

    // SETTING CUSTOM HEADERS.
    /*
    Assuming, every user, once created is logged in, no need for email validation.
    We need to send the JSON web token to them immediately.

    Once you are sending your custom headers, prepend it with x, then the rest of the data.

    Instead of generating this jwt tokens everytime we use it, we can make it part
    of the user model, following the [INFORMATION EXPERT PRINCIPLE] from OOP.
    */
    const token = user.generateAuthToken()
    // Remember to add the (access-control-expose-headers) to enable our front-end read it.
    res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(user, ['_id', 'name', 'email']))

})


module.exports = router


// The bcrypt module is used for hashing passwords in node js

/*
const bcrypt = require('bcrypt')

async function run() {
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash('promise', salt)
    console.log(salt)
    console.log(hashed)
}

run()

*/



/*
Registering a user:
1. Create the user model
2. Collect his username, other neccassry info
3. Collect his password.
4. Store the hashed version of his password in the database.
5. From the user model, generate an authentication token and return it to the client.


Login:
1. Collect the user's username
2. If it exists, continue, else return a 400 error
3. compare the password with the hashed password in the database, and if it works
4. Send the authentication token to the client.


Authentication
1. For every request, we will send the auth token
2. Then with the auth token, we will check if it is valid, then if it is, we will grant access
3. We can store some information in the jwt for more gathering info.
4. Then we will use this information for authorization.
*/