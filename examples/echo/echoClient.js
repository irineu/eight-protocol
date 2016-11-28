////////////////////////////////////////
//IT WILL NOT WORK WITH TELNET CLIENT!!!
////////////////////////////////////////

var constants = require("../helpers/constants");
var protocol = require("../../index");

var client = new protocol.client("0.0.0.0", constants.port);

client.on("client_connected", function(socket){
	console.log("Connected on the server");

	protocol.send(socket, {transaction : "GREETINGS"}, "Hello World!");
})

