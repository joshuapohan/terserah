const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const favicon = require('serve-favicon')

const {getRandomRestaurant, getRestaurantDetails} = require('./utils/api');
const publicPath = path.join(__dirname, '../public');
const buildPath = path.join(__dirname, '../client/build');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

/**********************************************************************************************
Need to put home route first otherwise index.html from public path is going to be served first
Other option : add second parameter to express.static(path, {index: false})
***********************************************************************************************/
app.get('/', (req, res)=>{
	res.status(200).sendFile(buildPath + '/index.html');
});

app.use(express.static(publicPath));
app.use(express.static(buildPath));
app.use(favicon(publicPath + '/images/favicon.ico'));


app.get('/test', (req, res)=>{
	res.status(200).sendFile(publicPath + '/index.html');
});

app.get('/prod', (req, res)=>{
	res.status(200).sendFile(buildPath + '/index.html');
});

io.on('connection', (socket)=>{

	socket.on('getRandomFood', (location, callback)=>{
		getRandomRestaurant(location.latitude + ',' + location.longitude).then((restaurant)=>{
			callback(restaurant);
		});
	});


	socket.on('getMoreDetails', (restaurant, callback)=>{
		getRestaurantDetails(restaurant).then((restaurant_detail)=>{
			callback(restaurant_detail);
		});
	});
});

server.listen(process.env.PORT || 5000, ()=>{
	console.log('Server started on port ' + process.env.port);
});