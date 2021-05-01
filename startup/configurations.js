const config = require('config')


module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        console.error("[FATAL ERROR]: jwtPrivateKey is not defined.")
        process.exit(1)
        // We exit the process with 1, if you exit it with zero, it means
        // it terminated successfully, else any other number means it did not exit
        // successfully.
    }
}
