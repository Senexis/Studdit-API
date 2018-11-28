const Comment = require('../models/comment');

//comment has content, user & reply

module.exports = {
    index(req, res, next) {
        Comment.find({})
            .then(comments => res.send(comments))
            .catch(next);
    },

    create(req, res, next) {
        //TODO: Get user. add to comment
        const commentProps = req.body;

        Comment.create(commentProps)
            .then(comment => res.send(comment))
            .catch(next);
    },

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

        Comment.findByIdAndUpdate(commentId, commentProps)
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    replies(req, res, next) {
        const commentId = req.params.id;

        Comment.findById(commentId)
            .populate('replies')
            .orFail(() => Error('Not found'))
            .then(thread => res.send(thread))
            .catch(next);
    },

    reply(req, res, next) {
        const commentId = req.params.id;
        let commentProps = {
            user: req.body.user,
            content: req.body.content
        };

        let threadId;
        let newCommentId;

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
            .then(() => res.status(200).send('Success'))
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
        Thread.findOneAndUpdate(conditions, update)
            .orFail(() => Error('Not found'))
            .then(thread => res.redirect('..'))
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
        Comment.findOneAndUpdate(conditions, update)
            .orFail(() => Error('Not found'))
            .then(thread => res.redirect('..'))
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