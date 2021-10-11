const config = require('config')

module.export = function(req, res, next) {
    // 403 - Forbidden: User does not have the right permission for the request
    // 401 - Invalid Token: User does not supply the correct token or is not authenticated.
    // 404 - Not Found: The requested resource is not found.
    if (!config.get('requiresAuth')) return next()
    if (!req.user.isAdmin) return res.status(403).send("Access Denied")
    next()
}