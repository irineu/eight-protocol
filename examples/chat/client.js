var protocol = require("eight-protocol");
var client = new protocol.client("0.0.0.0", 7890);
var readline = require('readline');

//this is a way for easily read lines, see more at: https://nodejs.org/api/readline.html
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on("client_connected", function(socket){
    console.log("Connected on server!");
});

client.on("client_end", function(socket){
	//exit when lost connectio with the server
    process.exit(0);
});


client.on("data", function(socket, header, dataBuffer){
    
    //Based in a property (transaction) on header, we can handle de message:
    switch(header.transaction){
    	case "ID":
    		rl.question('Type your name: ', (answer) => {
				protocol.send(socket, {transaction : "IDx", date : Date.now()}, answer);
			});
    	break;
    	case "WELCOME":
    		//start asking for messages to send
    		recursiveInput();
    	break;
    	case "MESSAGE":
    		//print a message
    		console.log(dataBuffer.toString());
    	break;
    	case "ERROR":
    		console.log("SERVER ERROR: " +dataBuffer.toString());
    		process.exit(1);
    	break;
    	default:
    		console.log("Unrecognized transaction "+ header.transaction);
    	break;
    }
});

function recursiveInput(){
	rl.question('', (answer) => {
		if(answer)
			protocol.send(client.socket, {transaction : "MESSAGE", date : Date.now()}, answer);
		recursiveInput();
	});
}