var socket = io();

socket.on('connect', function(){
	// alert('connected');
});

var randomFoodButton = jQuery('#random-food-btn');

randomFoodButton.on('click', function(){
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}
	randomFoodButton.attr('disabled', 'disabled').text('Getting Food');
	navigator.geolocation.getCurrentPosition(function(position){
		socket.emit('getRandomFood', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, function(restaurant){
			var res_name = jQuery('#restaurant-name');
			var address = jQuery('#restaurant-address');
			res_name.text(restaurant.name);
			address.text(restaurant.location.address);
			randomFoodButton.removeAttr('disabled').text('Terserah');
		});
	}, function(){
		alert("Unable to fetch location");
	});
});