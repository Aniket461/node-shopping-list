const path = require('path');//module to join path to the public folder
const express = require('express'); // express module which will help develop server easily



const publicPath = path.join(__dirname, '/public'); // joined the path to public folder
var app = express(); // server created
const port = process.env.PORT || 3000; // where we want to access our server

app.use(express.static(publicPath));



// telling server to listen on above given port
app.listen(port, function(){

	console.log("Server is up on port: " +port);
});