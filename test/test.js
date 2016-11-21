var assert = require('assert');
var protocol = require('./../index');

describe("Client/Server", function(){
	var server = {
		instance : null,
		clients : []
	}

	var client;
	var serverPort = 7890;

	describe('#server:listen()', function() {
		it('should start server', function(done) {
			server.instance = new protocol.server(serverPort, false);
			server.instance.once('server_listening', function(){
				done();
			});
		});
	});

	describe('#client:connect()', function() {
		it('should connect on server', function(done) {
			client = new protocol.client("0.0.0.0", serverPort);

			server.instance.once("client_connected", function(socket){
				server.clients.push(socket);
			})

			client.once('client_connected', function(socket){
			   done();
			});
		});
	});

	describe('#client:send/server:recv()', function() {
		it('should send a message for the server', function(done) {

			var _header = {key1: "put", key2: "any", key3: "data"};
			var _data  = "It will be a binary data client";

			server.instance.once("data", function(socket, header, dataBuffer){
				assert.equal(dataBuffer,	_data);
				assert.equal(header.key1,	_header.key1);
				assert.equal(header.key2,	_header.key2);
				done();
			})

			protocol.send(client.socket,_header,_data);
		});
	});

	describe('#client:recv/server:send()', function() {
		it('should receive a message from the server', function(done) {

			var _header = {key1: "put 1", key2: "any 2", key3: "data 3"};
			var _data  = "It will be a binary data from server";

			client.once("data",  function(socket, header, dataBuffer){
				assert.equal(dataBuffer,	_data);
				assert.equal(header.key1,	_header.key1);
				assert.equal(header.key2,	_header.key2);assert.equal(dataBuffer,_data);
				done();
			});

			protocol.send(server.clients[0],_header,_data);
		});
	});

	describe('#server:onDisconnect()', function() {
		it('should reconize when a client disconnect', function(done) {

			var _header = {key1: "put 1", key2: "any 2", key3: "data 3"};
			var _data  = "It will be a binary data from server";

			server.instance.once("client_close",  function(socket, header, dataBuffer){
				assert.equal(server.clients[0].id,	socket.id);
			});

			server.instance.once("client_end",  function(socket, header, dataBuffer){
				assert.equal(server.clients[0].id,	socket.id);
				done();
			});

			client.socket.end();
		});
	});

	describe('#client:onDisconnect()', function() {
		it('should reconize when the server disconnect a client', function(done) {
			this.timeout(1000);
			client = new protocol.client("0.0.0.0", serverPort);

			server.instance.once("client_connected", function(socket){
				server.clients.push(socket);

				setTimeout(function(){
					socket.end();
				},200);
			})

			client.once('client_connected', function(socket){
				client.once("client_end", function(){
					done();
				});
			});
		});
	});

	describe('#server:onDisconnect()', function() {
		it('should reconize when a client disconnect from the server', function(done) {
			this.timeout(5000);

			server.instance.once("client_connected", function(socket){
				var s = socket;
				server.instance.once("client_end", function(socket){
					assert.equal(socket.id, s.id);
					done();
				});
			});

			client = new protocol.client("0.0.0.0", serverPort);
			client.once('client_connected', function(socket){
				
				setTimeout(function(){
					socket.end();
				},200);
				
			});
		});
	});

});
