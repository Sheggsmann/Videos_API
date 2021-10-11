const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// Defining methods or functions for a model through the schema
// These methods are applicable to the instances of the user class.
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin, name: this.name, email: this.email }, config.get('jwtPrivateKey'))
}


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(7).max(255).required()
    })
    return schema.validate(user)
}


module.exports.User = mongoose.model('User', userSchema)
module.exports.validate = validateUser


