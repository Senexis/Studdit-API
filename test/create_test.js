const assert = require('assert');
const User = require('../models/user');
const Comment = require('../models/comment');

describe('Creating records', () => {
  it('saves a user', (done) => {
      const joe = new User({ name: "Joe"});
      joe.save()
          .then(() => {
              assert(!joe.isNew);
              done();
      });
  });

  it('Create a comment', (done) => {
    const comment = new Comment({ content: "Comment from testing!"});

    comment.save()
      .then(() => {
        assert(!comment.isNew);
        done();
      });
  })
});
