module.exports = (app) => {
    app.get('*', (req, res) => {
        res.status(200).send({
            message: 'Application is running'
        }).end();
    })
};