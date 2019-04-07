const Thread = require('../models/thread');
const Comment = require('../models/comment');
const request = require('request-promise-native');

module.exports = {
    index(req, res, next) {
        Thread.find({})
            .then(threads => res.send(threads))
            .catch(next);
    },

    create(req, res, next) {
        const threadProps = {
            username: req.body.username,
            title: req.body.title,
            content: req.body.content,
        };

        const url = `${req.protocol}://${req.get('Host')}/api/users/${threadProps.username}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => Thread.create(threadProps))
            .then(thread => res.send(thread))
            .catch(next);
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
        const threadProps = {
            content: req.body.content
        };

        Thread.findByIdAndUpdate(threadId, threadProps, {new: true})
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    replies(req, res, next) {
        const threadId = req.params.id;

        Thread.findById(threadId)
            .populate('comments')
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    reply(req, res, next) {
        const threadId = req.params.id;
        const commentProps = {
            username: req.body.username,
            content: req.body.content,
            thread: threadId
        };

        let newCommentId;

        const url = `${req.protocol}://${req.get('Host')}/api/users/${commentProps.username}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => Thread.findById(threadId).orFail(() => Error('Not found')))
            .then(() => Comment.create(commentProps))
            .then(comment => {
                newCommentId = comment._id;
            })
            .then(() => Thread.findByIdAndUpdate(threadId, {
                "$push": {
                    comments: newCommentId
                }
            }))
            .then(() => res.status(200).send('Success'))
            .catch(next);
    },

    upvote(req, res, next) {
        const threadId = req.params.id;
        const threadPropUser = req.body.username;

        const conditions = {
            _id: threadId,
            'upvotes.username': {
                $ne: threadPropUser
            }
        }

        const update = {
            $addToSet: {
                upvotes: threadPropUser
            },
            $pull: {
                downvotes: threadPropUser
            }
        }

        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        const url = `${req.protocol}://${req.get('Host')}/api/users/${threadPropUser}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => Thread.findOneAndUpdate(conditions, update).orFail(() => Error('Not found')))
            .then(thread => res.redirect('..'))
            .catch(next);
    },

    downvote(req, res, next) {
        const threadId = req.params.id;
        const threadPropUser = req.body.username;

        const conditions = {
            _id: threadId,
            'downvotes.username': {
                $ne: threadPropUser
            }
        }

        const update = {
            $addToSet: {
                downvotes: threadPropUser
            },
            $pull: {
                upvotes: threadPropUser
            }
        }

        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        const url = `${req.protocol}://${req.get('Host')}/api/users/${threadPropUser}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(Thread.findOneAndUpdate(conditions, update).orFail(() => Error('Not found')))
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