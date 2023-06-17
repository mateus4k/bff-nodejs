const fastify = require('fastify');
const PostsController = require('./controllers/posts');

const app = fastify({
    logger: false,
});

const postsController = new PostsController();

app.get('/posts', async (req, reply) => {
    const posts = await postsController.getPosts();
    return reply.send(posts);
});

app.get('/posts/:id', async (req, reply) => {
    const id = req.params.id;
    const posts = await postsController.getPost(id);
    return reply.send(posts);
});

app.listen({ port: 5000 }, (error, address) => {
    if (error) throw error;

    console.log('Running!')
});
