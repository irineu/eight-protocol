////////////////////////////////////////
//IT WILL NOT WORK WITH TELNET CLIENT!!!
////////////////////////////////////////

import constants from "../helpers/constants.js";
import protocol from "../../index.js";

var client = new protocol.client("0.0.0.0", constants.port);

client.on("client_connected", function(socket){
	console.log("Connected on the server");
	protocol.send(socket, {transaction : "GREETINGS"}, "Hello World!");
});

client.on("client_error", function(socket, err){
	console.log("Connection error", err);
});