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
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;