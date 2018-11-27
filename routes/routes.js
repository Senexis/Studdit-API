
const ThreadsController = require('../controllers/threads_controller');
const UserController = require('../controllers/user_controller');
const FriendController = require('../controllers/friendship_controller');
const CommentController = require('../controllers/comment_controller');

module.exports = (app) => {
    // app.get('*', (req, res) => {
    //     res.status(200).send({
    //         message: 'Application is running'
    //     }).end();
    // })

    // Thread endpoints
    app.post('/api/threads', ThreadsController.create);
    app.put('/api/threads/:id', ThreadsController.edit);
    app.delete('/api/threads/:id', ThreadsController.delete);
    app.get('/api/threads', ThreadsController.index);

    //User endpoints
    //app.get('/api/user', UserController.index);
    app.get('/api/users/:username', UserController.getOne);
    app.post('/api/users', UserController.create);
    app.put('/api/users/updatepwd/:username', UserController.updatePassword);
    app.delete('/api/users/:username', UserController.delete);

    //Friendship endpoints
    app.post('/api/friendships', FriendController.create);
    app.delete('/api/friendships', FriendController.delete);

    //Comment endpoints
    app.get('/api/comments', ThreadsController.index);
    app.post('/api/comments', CommentController.create);
    app.delete('/api/comments', FriendController.delete);
};