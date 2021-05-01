const validateObjectId = require('../middlewares/validateObjectId')
const asyncMiddleware = require('../middlewares/async')
const validateMiddleware = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const { Genre, validate } = require('../models/genre')
const express = require('express')
const router = express.Router()


router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre
    .find({})
    .limit(10)
    .select('name')

    res.send(genres)
}))


router.get('/:id', validateObjectId, asyncMiddleware(async (req, res) => {
    const genre = await Genre.find({_id: req.params.id})
    if (genre) {
        return res.send(genre)
    }
    return res.status(400).send("Could not find genre with the given ID.")
}))


// Here we passed the middleware functions in an array, to execute them in sequence.
router.post('/', [auth, validateMiddleware(validate)], async (req, res) => {
    const genre = new Genre({
        name: req.body.name
    })
    const result = await genre.save()
    res.send(result)
})



router.put('/:id', [auth, validateMiddleware(validate)], asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    res.send(genre)
}))


router.delete('/:id', auth, asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    res.send(genre)
}))



module.exports = router