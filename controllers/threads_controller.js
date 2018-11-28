const Thread = require('../models/thread');

module.exports = {
    index(req, res, next) {
        Thread.find({})
            .then(threads => res.send(threads))
            .catch(next);
    },

    create(req, res, next) {
        const threadProps = req.body;

        Thread.create(threadProps)
            .then(thread => res.send(thread))
            .catch(next)
    },

    read(req, res, next) {
        const threadId = req.params.id;

        Thread.findById(threadId)
            .then(thread => res.send(thread))
            .catch(next);
    },

    edit(req, res, next) {
        const threadId = req.params.id;
        const threadProps = { content: req.body.content };

        Thread.findByIdAndUpdate(threadId, threadProps)
            .then(thread => res.send(thread))
            .catch(next);
    },

    reply(req, res, next) {
        const threadId = req.params.id;
    },

    upvote(req, res, next) {
        const threadId = req.params.id;
    },

    downvote(req, res, next) {
        const threadId = req.params.id;
    },

    delete(req, res, next) {
        const threadId = req.params.id;

        Thread.findByIdAndDelete(threadId)
            .then(thread => res.status(204).send(thread))
            .catch(next);
    }
};