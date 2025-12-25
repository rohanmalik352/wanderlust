class ExpressError extends Error {
    constructor(statusCode, message) {  // Change parameter to camelCase
        super();
        this.statusCode = statusCode;   // Change property to camelCase
        this.message = message;
    }
}
module.exports = ExpressError;