const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

const CommentSchema = new Schema({
    username: {
        type: String,
        required: [true, 'User is required.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.']
    },
    thread: {
        type: Schema.Types.ObjectId,
        ref: 'thread',
        required: [true, 'Thread is required.']
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    upvotes: [{
        type: String,
        required: [true, 'User is required.']
    }],
    downvotes: [{
        type: String,
        required: [true, 'User is required.']
    }],
}, schemaOptions);

CommentSchema.virtual('upvotesCount').get(function () {
    return this.upvotes.length;
});

CommentSchema.virtual('downvotesCount').get(function () {
    return this.downvotes.length;
});

var autoPopulateChildren = function (next) {
    this.populate('replies');
    next();
};

CommentSchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren);

CommentSchema.method('toJSON', function () {
    var comment = this.toObject();
    delete comment.upvotes;
    delete comment.downvotes;
    return comment;
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;