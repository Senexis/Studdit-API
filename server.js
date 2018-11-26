const express = require('express');
const app = express();

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