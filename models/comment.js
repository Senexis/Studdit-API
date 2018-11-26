const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
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