const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  title: String,
  content: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
});

ThreadSchema.virtual('upvotesCount').get(function () {
  return this.upvotes.length;
});

ThreadSchema.virtual('downvotesCount').get(function () {
  return this.downvotes.length;
});

const Thread = mongoose.model('thread', ThreadSchema);

module.exports = Thread;