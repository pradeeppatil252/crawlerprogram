var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
 
// parse application/json 
app.use(bodyParser.json());

var crawler = require("./crawlerApp/crawler.js");

app.use("/crawler", crawler);

app.listen(3000, function(){

	console.log("Connected to server at port 3000..");
});

module.exports = app;