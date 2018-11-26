
const ThreadsController = require('../controllers/threads_controller');
const UserController = require('../controllers/user_controller');

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

    app.get('/api/user', UserController.index);
};