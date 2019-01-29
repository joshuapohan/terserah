require('./../../config/config');

const axios = require('axios');
const _ = require('lodash');

const tmpList = {};

function getRndInteger(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getNearbyVenues(ll){
	try{
		const _id = process.env.CLIENT_ID || process.env.client_id;
		const _secret = process.env.CLIENT_SECRET || process.env.client_secret;
		const res = await axios.get('https://api.foursquare.com/v2/venues/explore?ll=' + ll + '&section=food&client_id=' + _id +'&client_secret=' + _secret + '&v=20190101');
		return res;
	} catch(e){
		throw new Error(e.message);
	}
}

function getTempNearbyLocation(ll){
	//iterate through stored list, check if within radius
	let lat = parseFloat(ll.split(',')[0]);
	let long = parseFloat(ll.split(',')[1]);

	for(var latlong in tmpList){
		let lat_ref = parseFloat(latlong.split(',')[0]);
		let long_ref = parseFloat(latlong.split(',')[1]);
		let radius =  ((lat - lat_ref) ** 2 + (long - long_ref) ** 2 ) ** 0.5;

		//current threshold is around 500m
		if(radius < 0.005){
			return tmpList[latlong];
		}
	}
}

async function getRandomRestaurant(location){
	const ll = location;

	//check if location is within radius of existing stored location first
	let restaurants = getTempNearbyLocation(ll);

	if(typeof restaurants === 'undefined'){
		try{
			const api_res = await getNearbyVenues(ll);
			restaurants =  api_res.data.response.groups[0].items.map((venue)=>{
					return _.pick(venue.venue,['name', 'location']);
				});
			tmpList[ll] = restaurants;
		} 
		catch(e){
			console.log(e);
		}
	}

	const rand = getRndInteger(0, restaurants.length - 1);
	//
	getRestaurantDetails(restaurants[rand]);
	//
	return restaurants[rand];
}

async function getRestaurantDetails(restaurant){
	const api_key = process.env.ZOMATO_KEY || process.env.zomato_key;
	const lat = restaurant.location.lat;
	const lon = restaurant.location.lng;
	const name = encodeURI(restaurant.name);
	const requestURL = 'https://developers.zomato.com/api/v2.1/search?q='+ name +'&count=1&lat=' + lat + '&lon=' + lon + '&radius=100';
	const res = await axios.get(requestURL, {
		headers:{
			'user-key': api_key
		}
	});
	if(res && res.data && res.data.restaurants[0]){
		return 	_.pick(res.data.restaurants[0].restaurant, ['name', 'url', 'cuisines', 'thumb']);
	}
}

// getRandomRestaurant('-6.1649353,106.79182650000001').then((restaurant)=>{
// 	console.log(restaurant);
// }).catch((e)=>console.log(e));

module.exports = {
	getRandomRestaurant,
	getRestaurantDetails
};
