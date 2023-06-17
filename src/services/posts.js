const Http = require('../utils/http');

class PostsService {
    #client;

    constructor() {
        this.#client = new Http('http://127.0.0.1:3001');
    }

    /**
     * @param {number} limit 
     */
    async getPosts(limit = 5) {
        const response = await this.#client.request({
            method: 'GET',
            path: '/posts',
            timeout: 5000,
        });

        const data = await response.body.json();

        const posts = [];

        for (const post of data) {
            if (posts.length >= limit) continue;

            posts.push({
                id: post.id,
                authorId: post.authorId,
                title: post.title,
            });
        }

        return posts;
    }

    /**
     * @param {number} id
     */
    async getPost(id) {
        const response = await this.#client.request({
            method: 'GET',
            path: `/posts/${id}`,
            timeout: 5000,
        });

        const data = await response.body.json();

        return {
            id: data.id,
            title: data.title,
            text: data.text,
            authorId: data.authorId,
        };
    }
}

module.exports = PostsService