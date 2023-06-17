const PostsService = require("../services/posts");
const CommentsService = require("../services/comments");
const UsersService = require("../services/users");

const postService = new PostsService();
const commentsService = new CommentsService();
const usersService = new UsersService();

class PostsController {
    async getPosts() {
        const posts = await postService.getPosts();

        const authorIds = new Set();
        for (const post of posts) {
            authorIds.add(post.authorId)
        }

        const users = await usersService.getUsers([...authorIds]);

        for (const post of posts) {
            post.author = users.get(post.authorId);
            post.authorId = undefined;
        }

        console.log(posts[0]);

        return posts;
    }

    /**
     * @param {number} id 
     */
    async getPost(id) {
        try {
            // Fetch data
            const [post, comments] = await Promise.all([
                postService.getPost(id),
                commentsService.getComments(id),
            ]);

            // Mount user ids
            const userIds = new Set([post.authorId]);
            for (const comment of comments) {
                userIds.add(comment.userId);
            }

            // Fetch users
            const users = await usersService.getUsers([...userIds]);

            // Transform user data
            post.author = users.get(post.authorId);
            for (const comment of comments) {
                comment.user = users.get(comment.userId);
                comment.userId = undefined;
            }

            return {
                ...post,
                authorId: undefined,
                comments
            };
        } catch (error) {
            console.log(error);
            throw new Error('Fail to fetch post');
        }
    }
}

module.exports = PostsController;
