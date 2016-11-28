var protocol = require("eight-protocol");
var server =  new protocol.server(7890);

//A map for store active connections
var activeConnections = {};

server.on('server_listening', function(){
    console.log("server is ready!");
});

server.on('client_connected', function(socketClient){
	//send a transaction for identify the user
	protocol.send(socketClient, {transaction : "ID", date : Date.now()}, "");

	//store a reference of the socket in a map
	activeConnections[socketClient.id] = socketClient;
	console.log("ONLINE USERS: "+Object.keys(activeConnections).length);
});

server.on('client_close', function(socketClient){
	//broadcast the goodbye message
	Object.keys(activeConnections).forEach(function(k){
		protocol.send(activeConnections[k], {transaction : "MESSAGE", date : Date.now()}, socketClient.name+" was left!");
	});
	//Delete the reference of the user in our map
    delete activeConnections[socketClient.id];
    console.log("ONLINE USERS: "+Object.keys(activeConnections).length)
});

server.on("data", function(socketClient, header, dataBuffer){

	//Based in a property (transaction) on header, we can handle de message:
	switch(header.transaction){
		case "MESSAGE":
			//check if the socket already have idendified
			if(!socketClient.name) return protocol.send(socket, {transaction : "ERROR", date : Date.now()}, "ACCESS DENIED :"+msg);

			//Broadcast the message
			Object.keys(activeConnections).forEach(function(k){
				protocol.send(activeConnections[k], {transaction : "MESSAGE", date : Date.now()}, socketClient.name+" says:" + dataBuffer.toString());
			});
		break;
		case "ID":

			//Get the name and check if is valid
			var name = dataBuffer.toString();
			if(name){
				socketClient.name = name;

				//send a transaction for the client for start typeing
				protocol.send(socketClient, {transaction : "WELCOME", date : Date.now()}, "");

				//Then broadcast the wellcome message
				Object.keys(activeConnections).forEach(function(k){
					protocol.send(activeConnections[k], {transaction : "MESSAGE", date : Date.now()}, socketClient.name+" entered on chat!");
				});
			}else{
				//send a message to input a valid name
				protocol.send(socketClient, {transaction : "ERROR", date : Date.now()}, "invalid name");
			}
		break;
		default:
			console.log("Unrecognized transaction "+ header.transaction);
			socketClient.end();
		break;
	}
});
