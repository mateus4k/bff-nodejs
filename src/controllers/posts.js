const PostsService = require("../services/posts");
const CommentsService = require("../services/comments");
const UsersService = require("../services/users");

const postService = new PostsService();
const commentsService = new CommentsService();
const usersService = new UsersService();

class PostsController {
    async getPosts() {
        const posts = await postService.getPosts();

        const resultPromise = posts.map(async (post) => {
            const user = await usersService.getUser(post.authorId);

            return {
                ...post,
                authorId: undefined,
                author: user.name,
            }
        });

        const result = await Promise.all(resultPromise);

        return result;
    }

    /**
     * @param {number} id 
     */
    async getPost(id) {
        try {
            const [post, comments] = await Promise.all([
                postService.getPost(id),
                commentsService.getComments(id),
            ]);

            const postAuthor = await usersService.getUser(post.authorId);

            const commentsPromise = comments.map(async (comment) => {
                const commentAuthor = await usersService.getUser(comment.userId);

                return {
                    ...comment,
                    user: commentAuthor.id,
                    userId: undefined,
                }
            });

            const commentsData = await Promise.all(commentsPromise);

            return {
                ...post,
                author: postAuthor.name,
                authorId: undefined,
                comments: commentsData,
            };
        } catch (error) {
            console.log(error);
            throw new Error('Fail to fetch post');
        }
    }
}

module.exports = PostsController;
