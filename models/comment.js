const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
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
  }]
});

var autoPopulateChildren = function (next) {
  this.populate('replies');
  next();
};

CommentSchema
  .pre('findOne', autoPopulateChildren)
  .pre('find', autoPopulateChildren)

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;