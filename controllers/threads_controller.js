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
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    edit(req, res, next) {
        const threadId = req.params.id;
        const threadProps = { content: req.body.content };

        Thread.findByIdAndUpdate(threadId, threadProps)
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    reply(req, res, next) {
        const threadId = req.params.id;
    },

    upvote(req, res, next) {
        const threadId = req.params.id;
        const threadPropUser = req.body.username;

        const conditions = {
            _id: threadId,
            'upvotes.username': { $ne: threadPropUser }
        }
        
        const update = {
            $addToSet: { upvotes: threadPropUser },
            $pull: { downvotes: threadPropUser }
        }
        
        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        Thread.findOneAndUpdate(conditions, update)
            .orFail(() => Error('Not found'))
            .then(thread => res.redirect('..'))
            .catch(next);
    },

    downvote(req, res, next) {
        const threadId = req.params.id;
        const threadPropUser = req.body.username;

        const conditions = {
            _id: threadId,
            'downvotes.username': { $ne: threadPropUser }
        }
        
        const update = {
            $addToSet: { downvotes: threadPropUser },
            $pull: { upvotes: threadPropUser }
        }
        
        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        Thread.findOneAndUpdate(conditions, update)
            .orFail(() => Error('Not found'))
            .then(thread => res.redirect('..'))
            .catch(next);
    },

    delete(req, res, next) {
        const threadId = req.params.id;

        Thread.findByIdAndDelete(threadId)
            .orFail(() => Error('Not found'))
            .then(thread => res.status(204).send(thread))
            .catch(next);
    }
};