const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {getRandomRestaurant} = require('./utils/api');
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

app.get('/test', (req, res)=>{
	res.status(200).sendFile(publicPath + '/index.html');
});

io.on('connection', (socket)=>{

	socket.on('getRandomFood', (location, callback)=>{
		getRandomRestaurant(location.latitude + ',' + location.longitude).then((restaurant)=>{
			callback(restaurant);
		});
	});
});

server.listen(process.env.port, ()=>{
	console.log('Server started on port ' + process.env.port);
});