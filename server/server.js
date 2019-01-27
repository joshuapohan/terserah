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

// app.get('/', (req, res)=>{
// 	res.status(200).send('Hello World');
// });

io.on('connection', (socket)=>{

	socket.on('getRandomFood', (location, callback)=>{
		getRandomRestaurant(location.latitude + ',' + location.longitude).then((restaurant)=>{
			callback(restaurant);
		});
	});
});

server.listen('3000', ()=>{
	console.log('Server started on port 3000');
});