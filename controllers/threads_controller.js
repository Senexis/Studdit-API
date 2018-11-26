const Thread = require('../models/thread');

module.exports = {
    index(req, res, next) {
        Thread
            .then(threads => res.send(threads))
            .catch(next);
    },

    create(req, res, next) {
        const threadProps = req.body;

        Thread.create(threadProps)
            .then(thread => res.send(thread))
            .catch(next)
    },

    edit(req, res, next) {
        const threadId = req.params.id;
        const threadProps = req.body;

        Thread.findByIdAndUpdate({
                _id: threadId
            }, threadProps)
            .then(() => Thread.findById({
                _id: id
            }))
            .then(thread => res.send(thread))
            .catch(next);
    },

    delete(req, res, next) {
        const threadId = req.params.id;

        Thread.findByIdAndRemove({
                _id: threadId
            })
            .then(thread => res.status(204).send(thread))
            .catch(next);
    }
};