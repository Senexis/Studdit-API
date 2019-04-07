const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;

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

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));
conn.once('open', () => {
	console.log('MongoDB connected.')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 5000, () => {
	if (process.env.PORT !== undefined) {
		console.log(`Server started at "http://localhost:${process.env.PORT}/".`);
	} else {
		console.log(`Server started at "http://localhost:5000/".`);
	}
});

routes(app);

app.use((err, req, res, next) => {
	res.status(422).send({
		error: err.message
	});
});

module.exports = app;