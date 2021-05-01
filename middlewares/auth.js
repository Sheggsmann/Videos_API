const jwt = require('jsonwebtoken')
const config = require('config')


// Middleware for authorization
module.exports = function(req, res, next) {
    // Get the token from the request header.
    const token = req.header('x-auth-token')
    // If it is not valid, return an Access Denied error
    if (!token) return res.status(401).send("Access Denied, No token given")

    // If the token is not valid, it raises an excpetion
    try {
        // If the token is valid, the use has access to our site,
        // and then we pass access to the next middleware function.
        req.user = jwt.verify(token, config.get('jwtPrivateKey'))
        next()
    }
    catch (e) {
        // Handles the exception and sends appropriate error to the client.
        res.status(400).send("Invalid token")
    }
}            
