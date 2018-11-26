const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const Thread = require('../src/thread');

describe('Assocations', () => {
  let joe, thread, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    thread = new Thread({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.threads.push(thread);
    thread.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), thread.save(), comment.save()])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' }).then()
      .then((user) => {
        console.log(user);
        done();
      });
  });
});
