var request = require("request");
var cheerio = require("cheerio");

var async = require("async");
var Excel = require('exceljs');

var xlsx = require('xlsx-writestream');

var count = 0;

exports.crawlMediumAsync = function crawlMediumAsync(req, callback){

	taskArray = [];

	request({
	  uri: "https://medium.com",
	}, function(error, response, body) {

		  $ = cheerio.load(body);
	  	  links = $('a'); //jquery get all hyperlinks
	  	  $(links).each(function(i, link){
	  	  	taskArray.push({"href" : $(link).attr('href')});
	  	  });

	  	  console.log("taskArray length : " + taskArray.length);

	  	  intializeExcel(taskArray, "create", function(err, result){
	  	  	if(!err){
	  	  		console.log("Excel file has been intialized sucessfully");
	  	  		exceuteTaskArray(taskArray, function(err, result){
	  	  			
	  	  		});
	  	  	}
	  	  });
	});
}

function exceuteTaskArray(urlArray, maincallback){	

	if(urlArray.length !==0){

		q = async.queue(function (task, callback) {
		    callback(false, task.href);
		}, 5);

		q.push(urlArray, function (err, href) {

			var urlArray = [];

			request({
			  uri: href,
			}, function(error, response, body) {

				if(!error){	
					  $ = cheerio.load(body);
				  	  links = $('a'); //jquery get all hyperlinks
				  	  $(links).each(function(i, link){
				  	  	urlArray.push({"href" : $(link).attr('href')});
				  	  });

				  	  if(urlArray.length !== 0){
					  	  console.log("Href : " + href);
					  	  console.log("url Array : " + urlArray.length);
					  	  taskArray.push.apply(taskArray, urlArray);
					  	  console.log("Task Array : " + taskArray.length); 

					  	  /*intializeExcel(urlArray, "update", function(err, result){
					  	  	if(!err){
					  	  		console.log("Excel file has been appended sucessfully");*/
					  	  		exceuteTaskArray(urlArray, function(err, result){
						  	  		if(!err){
						  	 
						  	  		}
						  	  	});
					  	  	//}
					  	//});
					  }else {
					  	maincallback(false, "Processing for that task is complete..");
					  }	  
			  	} 
			});
		});
	}else {
		maincallback(false, "Processing for that task is complete..");
	}
}


function intializeExcel(taskArray, operation, callback){

	var xlsxColumns = [
         		      { header: 'URL', key: 'url', width: 50},
         		    ];

    var rows = [];     		    
         		    
    for(var i=0; i<taskArray.length ;i++){
    	var urlDoc = {
    		"url" : taskArray[i].href
    	}
    	rows.push(urlDoc);
    } 

	var pathToCreate = "E:\\Node Projects\\websiteURLs.xlsx";

	if(operation === "create"){
	    createExcel(xlsxColumns, rows, pathToCreate, taskArray.length, "URLSList", function(err, result){
	    	if(!err){
				callback(false, result);    		
	    	}else{
	    		callback(true, result);
	    	}
	    });
	}else {
		appendToExcel(xlsxColumns, rows, pathToCreate, taskArray.length, "URLSList", function(err, result){
	    	if(!err){
				callback(false, result);    		
	    	}else{
	    		callback(true, result);
	    	}
	    });
	}        		     
}

function createExcel(columns, rows, pathToCreate, count, sheetName, callback){
	
	 workbook = new Excel.Workbook();

     sheet = workbook.addWorksheet(sheetName);
    
     sheet.columns = columns;

     for(var i = 0; i <rows.length; i++){
    	 sheet.addRow(rows[i]);
     }

     workbook.xlsx.writeFile(pathToCreate)
     .then(function(err) {
    	if(!err){
	    	callback(false, "Intialize of the excel is complete");
    	}else{
	    	callback(true, "Creating and Writing to excel file failed");
    	}
     });
}

/*
function appendToExcel(columns, rows, pathToCreate, count, sheetName, callback){

	/*sheet = workbook.getWorksheet(sheetName);

     for(var i = 0; i <rows.length; i++){
    	 sheet.addRow(rows[i]);
     }*/

     /*workbook.xlsx.writeFile(pathToCreate)
     .then(function(err) {
    	if(!err){
	    	callback(false, "Append of URL's to excel file is complete");
    	}else{
	    	callback(true, "Append of URL's to excel file failed");
    	}
     });*/

    /* xlsx.write(pathToCreate, rows, function (err) {
    	// Error handling here
	});
 }*/