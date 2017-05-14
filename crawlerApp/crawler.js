var express = require('express');
var app = express();

var crawlerFunctionalities = require('./crawlerFunctionalities.js');

app.get('/crawlMediumWebsite', function(req,res){

	crawlerFunctionalities.crawlMediumAsync(req, function(err, response){
		/*res.statusCode = response.http_code;
		res.json(response);*/

		console.log("The Functionality is complete....");
	});

});

module.exports = app;