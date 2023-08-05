const CircuitBreaker = require('opossum');
const Http = require('../utils/http');

class UsersService {
    #client;
    #cbGetUsers;

    constructor() {
        this.#client = new Http('http://127.0.0.1:3003');
        this.#cbGetUsers = new CircuitBreaker(async (ids) => {
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
        }, {
            timeout: 3000,
            errorThresholdPercentage: 50,
        });
        this.#cbGetUsers.fallback(() => []);
    }

    /**
     * @param {number[]} ids 
     */
    async getUsers(ids) {
        return this.#cbGetUsers.fire(ids);
    }
}

module.exports = UsersService