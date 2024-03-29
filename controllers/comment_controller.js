const Comment = require('../models/comment');
const request = require('request-promise-native');

module.exports = {
    read(req, res, next) {
        const commentId = req.params.id;

        Comment.findById(commentId)
            .orFail(() => Error('Not found'))
            .then(comment => res.send(comment))
            .catch(next);
    },

    edit(req, res, next) {
        const commentId = req.params.id;
        const commentProps = {
            content: req.body.content
        };

        Comment.findByIdAndUpdate(commentId, commentProps, { new: true })
            .orFail(() => Error('Not found'))
            .then(comment => res.send(comment))
            .catch(next);
    },

    replies(req, res, next) {
        const commentId = req.params.id;

        Comment.findById(commentId)
            .populate('replies')
            .orFail(() => Error('Not found'))
            .then(comment => res.send(comment.replies))
            .catch(next);
    },

    reply(req, res, next) {
        const commentId = req.params.id;
        let commentProps = {
            username: req.body.username,
            content: req.body.content
        };

        let newCommentId;

        const url = `${req.protocol}://${req.get('Host')}/api/users/${commentProps.username}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => {
                Comment.findById(commentId)
                    .orFail(() => Error('Not found'))
                    .then(comment => {
                        commentProps.thread = comment.thread;
                    })
                    .then(() => Comment.create(commentProps))
                    .then(comment => {
                        newCommentId = comment._id;
                    })
                    .then(() => Comment.findByIdAndUpdate(commentId, {
                        "$push": {
                            replies: newCommentId
                        }
                    }))
                    .then(() => res.redirect('/api/comments/' + newCommentId))
                    .catch(next);
            })
            .catch(next);
    },

    upvote(req, res, next) {
        const commentId = req.params.id;
        const commentPropUser = req.body.username;

        const conditions = {
            _id: commentId,
            'upvotes.username': {
                $ne: commentPropUser
            }
        }

        const update = {
            $addToSet: {
                upvotes: commentPropUser
            },
            $pull: {
                downvotes: commentPropUser
            }
        }

        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        const url = `${req.protocol}://${req.get('Host')}/api/users/${commentPropUser}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => Comment.findOneAndUpdate(conditions, update, { new: true }).orFail(() => Error('Not found')))
            .then(comment => res.send(comment))
            .catch(next);
    },

    downvote(req, res, next) {
        const commentId = req.params.id;
        const commentPropUser = req.body.username;

        const conditions = {
            _id: commentId,
            'downvotes.username': {
                $ne: commentPropUser
            }
        }

        const update = {
            $addToSet: {
                downvotes: commentPropUser
            },
            $pull: {
                upvotes: commentPropUser
            }
        }

        // This should error if the document is not found, but this seems to be a bug.
        // See: https://github.com/Automattic/mongoose/issues/7280
        const url = `${req.protocol}://${req.get('Host')}/api/users/${commentPropUser}`;

        request.get(url)
            .then((result) => {
                if (result == "[]") {
                    throw new Error('User does not exist.');
                }
            })
            .then(() => Comment.findOneAndUpdate(conditions, update, { new: true }).orFail(() => Error('Not found')))
            .then(comment => res.send(comment))
            .catch(next);
    },

    delete(req, res, next) {
        const commentId = req.params.id;

        Comment.findByIdAndDelete(commentId)
            .orFail(() => Error('Not found'))
            .then(comment => res.status(204).send(comment))
            .catch(next);
    }
};