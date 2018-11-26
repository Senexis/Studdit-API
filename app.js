const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes/routes');

const app = express();
const mongodbUrl = 'mongodb://@ds117164.mlab.com:17164/studdit_db';

mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, {
	useNewUrlParser: true,
	auth: {
		user: config.userName,
		password: config.pwd
	  }
});

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

conn.once('open', () => {
	console.log('MongoDB connected.')
});

app.listen(process.env.PORT || 5000, () => {
	if (process.env.PORT !== undefined) {
		console.log(`Server started at "http://localhost:${process.env.PORT}/".`);
	} else {
		console.log(`Server started at "http://localhost:5000/".`);
	}
});

app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
	res.status(422).send({
		error: err.message
	});
});

module.exports = app;