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
    app.post('/api/threads/:id', ThreadsController.reply);
    app.post('/api/threads/:id/upvote', ThreadsController.upvote);
    app.post('/api/threads/:id/downvote', ThreadsController.downvote);
    app.delete('/api/threads/:id', ThreadsController.delete);

    // Comment endpoints
    app.get('/api/comments', CommentController.index);
    app.post('/api/comments', CommentController.create);
    app.get('/api/comments/:id', UserController.read);
    app.put('/api/comments/:id', UserController.edit);
    app.post('/api/comments/:id', CommentController.reply);
    app.delete('/api/comments/:id', CommentController.delete);

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