const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

const ThreadSchema = new Schema({
    username: {
        type: String,
        required: [true, 'User is required.']
    },
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.']
    },
    comments: [{
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

ThreadSchema.virtual('upvotesCount').get(function () {
    return this.upvotes.length;
});

ThreadSchema.virtual('downvotesCount').get(function () {
    return this.downvotes.length;
});

ThreadSchema.method('toJSON', function () {
    var thread = this.toObject();
    delete thread.upvotes;
    delete thread.downvotes;
    return thread;
});

ThreadSchema.pre('remove', function (next) {
    Comment.deleteMany({
        thread: this._id
    })
        .exec()
        .then(next);
});

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;