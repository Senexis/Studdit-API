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
            .then(comment => res.send(comment))
            .catch(next);
    },

    edit(req, res, next) {
        const commentId = req.params.id;
        const commentProps = { content: req.body.content };

        Comment.findByIdAndUpdate(commentId, commentProps)
            .then(thread => res.send(thread))
            .catch(next);
    },

    reply(req, res, next) {

    },

    delete(req, res, next) {
        const commentId = req.params.id;

        Comment.findByIdAndDelete(commentId)
            .then(Comment => res.status(204).send(Comment))
            .catch(next);
    }
};