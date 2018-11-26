const mongoose = require('mongoose');
const config = require('../config');

//Reference to ES6 promises
mongoose.Promise = global.Promise;

before((done) => {
  var mongodbUrl = 'mongodb://localhost/users-test'; // Local enviroment
  // var mongodbUrl ='mongodb://@ds117164.mlab.com:17164/studdit_db'; //Live DB link

  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    // auth: {
    //   user: config.userName,
    //   password: config.pwd
    // }
  });

  var conn = mongoose.connection;
  conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

  conn.once('open', () => {
    console.log('MongoDB connected.')
    done();
  });

/*
beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
});
*/
