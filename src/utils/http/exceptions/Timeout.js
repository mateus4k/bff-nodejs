class Timeout extends Error {
    constructor() {
        super('timeout exceeded');
    }
}

module.exports = Timeout;