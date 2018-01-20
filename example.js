var http = require('http'); // Import Node.js core module
var fs = require("fs");
var sha1 = require('sha1');
var queryString = require('query-string');

var server = http.createServer(function (req, res) {   //create web server
	res.setHeader("Access-Control-Allow-Origin", "*");
  	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.url == "/data") {
    	var json_data;
    	var body = '';
        req.on('data', function (data) {
            body += data;
            fs.readFile( __dirname + "/" + "login.json", 'utf8', function (err, data2) {
				data2 = JSON.parse( data2 );
				json_data = data2;
				var user_data = queryString.parse(body);
				var auth = false;
				var user_i = 0;
	        	for (var i = json_data.length - 1; i >= 0; i--) {
					if(json_data[i].username == user_data.username &&
						json_data[i].password == sha1(user_data.password)){
	        				auth = true;
	        				user_i = i;
					}
				}
				if(auth){
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end(JSON.stringify(json_data[user_i]));
				}
				else{
					res.writeHead(401, {'Content-Type': 'text/html'});
					res.end();
				}
		   });
        });

        req.on('end', function () {

        });
    }

    else
        res.end('Invalid Request!');

});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..')