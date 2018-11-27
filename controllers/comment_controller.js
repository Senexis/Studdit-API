const Comment = require('../models/comment');

//comment has content, user & reply

module.exports = {
    index(req, res, next){
        Comment.find({}, function (err, comments){
            res.send(comments);
        })
    },
    create(req, res, next){
        //TODO: Get user. add to comment
        const commentProps = req.body;

        Comment.create(commentProps)
            .then(comment => res.send(comment))
            .catch(next)    
    },
    delete(req, res, next){
        const commentId = req.params.id;

        Comment.findOneAndDelete({
                _id: commentId
            })
            .then(Comment => res.status(204).send(Comment))
            .catch(next);
    },
    reply(req, res, next){

    }
};