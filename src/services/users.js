const Http = require('../utils/http');

class UsersService {
    #client;

    constructor() {
        this.#client = new Http('http://127.0.0.1:3003');
    }

    /**
     * @param {number[]} ids 
     */
    async getUsers(ids) {
        const data = await this.#client.request({
            method: 'GET',
            path: '/users',
            query: { id: ids },
        }, {
            timeout: 3000,
        });

        const users = new Map();

        for (const comment of data) {
            users.set(comment.id, comment.name);
        }

        return users;
    }
}

module.exports = UsersService