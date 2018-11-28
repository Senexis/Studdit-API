const ThreadsController = require('../controllers/threads_controller');
const UserController = require('../controllers/user_controller');
const FriendController = require('../controllers/friendship_controller');
const CommentController = require('../controllers/comment_controller');

module.exports = (app) => {
    // Thread endpoints
    app.get('/api/threads', ThreadsController.index);
    app.post('/api/threads', ThreadsController.create);
    app.get('/api/threads/:id', ThreadsController.read);
    app.put('/api/threads/:id', ThreadsController.edit);
    app.delete('/api/threads/:id', ThreadsController.delete);
    app.get('/api/threads/:id/comments', ThreadsController.replies);
    app.post('/api/threads/:id/comments', ThreadsController.reply);
    app.post('/api/threads/:id/upvotes', ThreadsController.upvote);
    app.post('/api/threads/:id/downvotes', ThreadsController.downvote);

    // Comment endpoints
    app.get('/api/comments', CommentController.index);
    app.post('/api/comments', CommentController.create);
    app.get('/api/comments/:id', UserController.read);
    app.put('/api/comments/:id', UserController.edit);
    app.delete('/api/comments/:id', CommentController.delete);
    app.post('/api/comments/:id/comments', CommentController.reply);

    // User endpoints
    app.get('/api/users', UserController.index);
    app.post('/api/users', UserController.create);
    app.get('/api/users/:username', UserController.read);
    app.put('/api/users/:username', UserController.edit);
    app.delete('/api/users/:username', UserController.delete);

    // Friendship endpoints
    app.post('/api/friendships', FriendController.create);
    app.delete('/api/friendships', FriendController.delete);
};