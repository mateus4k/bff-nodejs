module.exports = class TimeoutException extends Error {
    constructor() {
        super('Timeout exceeded');
    }
}