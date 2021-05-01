const Joi = require('joi')
const mongoose = require('mongoose')


const Customer = mongoose.model("Customer", new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    phone: String
}))


function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(5).max(5).required()
    })
    return schema.validate(customer)
}

module.exports.Customer = Customer
module.exports.validate = validateCustomer
