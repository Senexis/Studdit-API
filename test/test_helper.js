const mongoose = require('mongoose');
require('dotenv').config();

//Reference to ES6 promises
mongoose.Promise = global.Promise;

before((done) => {
    if (process.env.mongoUseAuth == "true") {
        mongoose.connect(process.env.mongoUrl, {
            useNewUrlParser: true,
            auth: {
                user: process.env.mongoUsername,
                password: process.env.mongoPassword
            }
        });
    } else {
        mongoose.connect(process.env.mongoUrl, {
            useNewUrlParser: true
        });
    }

    let conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

    conn.once('open', () => {
        console.log('MongoDB connected.')
        done();
    });


    beforeEach((done) => {
        const { comments, threads } = mongoose.connection.collections;
        comments.drop(() => {
            threads.drop(() => {
                done();
            });
        });
    });
});

