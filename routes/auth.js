const bcrypt = require('bcrypt')
const Joi = require('joi')
const validate = require('../middlewares/validate')
const { User } = require('../models/user')
const express = require('express')

const router = express.Router()


router.post('/', validate(validateUser), async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password")

    // Here, we compare the password sent, with the hashed version stored in the database
    // the bcrypt.compare function is used to establish this.
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Incorrect Password")

    /*
    In Real world applications, we send JSON WEB TOKENS to the client 
    The client then stores it and uses it for further requests.

    This token contains, digital signatures, some useful data and the encryption 
    algorithm or header used.
    */   
    const token = user.generateAuthToken()
    res.send(token)
})


function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    })
    return schema.validate(user)
}


module.exports = router