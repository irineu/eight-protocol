////////////////////////////////////////
//IT WILL NOT WORK WITH TELNET CLIENT!!!
////////////////////////////////////////

var constants = require("./helpers/constants");
var protocol = require("../index");

var server =  new protocol.server(constants.port);

server.on('server_listening', function(){
	console.log("Server ir up! Now waiting for connections");
});

server.on('client_connected', function(socketClient){
	console.log("New client connected! id:"+socketClient.id+" origin:"+socketClient.address().address);
});

server.on('client_close', function(socketClient){
	console.log("Client disconnected! id:"+socketClient.id+" origin:"+socketClient.address().address);
});

server.on("data", function(socketClient, header, dataBuffer){
	console.log("socket id:"+socketClient.id+" sent the following message:"+dataBuffer.toString());
});