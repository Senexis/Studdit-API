const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');

var mongodbUri ='mongodb://@ds117164.mlab.com:17164/studdit_db'; //Live DB link
mongoose.Promise = global.Promise;

mongoose.connect(mongodbUri, {
	useNewUrlParser: true //Current URL string parser is depricated. 
});

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));  
 
conn.once('open', () =>{
 console.log('connected to database')                       
});

app.listen(process.env.PORT || 5000, () => { 
	if(process.env.PORT !== undefined){
		console.log('Server gestart op poort '+process.env.PORT); 
	} else {
		console.log('Server gestart op poort 5000'); 
	}
});

app.get('*', (req, res) => {
	res.status(200).send({
		message: 'Application is running'
	}).end();
})

module.exports = app;