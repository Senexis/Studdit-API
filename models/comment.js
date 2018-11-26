const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Content is required.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;