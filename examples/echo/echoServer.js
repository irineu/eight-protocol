////////////////////////////////////////
//IT WILL NOT WORK WITH TELNET CLIENT!!!
////////////////////////////////////////

var constants = require("../helpers/constants");
var protocol = require("../../index");

var server =  new protocol.server(constants.port);

server.on('server_listening', function(){
	console.log("Server is up! Now waiting for connections");
});

server.on('client_connected', function(socketClient){
	console.log("NEW CLIENT CONNECTED! \t id:"+socketClient.id+" origin:"+socketClient.address().address);
});

server.on('client_close', function(socketClient){
	console.log("CLIENT DISCONNECTED! \t id:"+socketClient.id);
});

server.on("data", function(socketClient, header, dataBuffer){
	console.log("MESSAGE RECEIVED! \t id:"+socketClient.id+" message:"+dataBuffer.toString());
});