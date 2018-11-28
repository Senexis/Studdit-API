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
        const commentProps = { content: req.body.content };

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
        const commentProps = {
            user: req.body.user,
            content: req.body.content
        };

        let newCommentId;

        // TODO add comment check.

        Comment.create(commentProps)
            .then(comment => { newCommentId = comment._id; })
            .then(() => Comment.findByIdAndUpdate(commentId, { "$push": { replies: newCommentId } }))
            .then(() => res.status(200).send('Success'))
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