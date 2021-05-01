const { Customer, validate } = require('../models/customer')
const validateMiddleware = require('../middlewares/validate')
const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {
    const customers = await Customer
    .find()
    .sort('name')
    res.send(customers)
})


router.post('/', validateMiddleware(validate), async (req, res) => {
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    customer = await customer.save()
    res.send(customer)
})


router.put('/:id', validateMiddleware(validate), async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    }, { new: true })

    res.send(customer)
})


router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    res.send(customer)
})


module.exports = router