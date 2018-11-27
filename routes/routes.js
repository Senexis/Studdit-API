
const ThreadsController = require('../controllers/threads_controller');
const UserController = require('../controllers/user_controller');
const FriendController = require('../controllers/friendship_controller');

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
    app.get('/api/user/:username', UserController.getOne);
    app.post('/api/user', UserController.create);
    app.put('/api/user/updatepwd/:username', UserController.updatePassword);
    app.delete('/api/user/:username', UserController.delete);

    //Friendship endpoints
    app.post('/api/friendship', FriendController.newFriendship);
    app.delete('/api/friendship', FriendController.endFriendship);
};