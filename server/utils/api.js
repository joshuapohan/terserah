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

async function getRandomRestaurant(location){
	const ll = location;

	const restaurants = await getNearbyVenues(ll).then((res)=>{
		const venues = res.data.response.groups[0].items.map((venue)=>{
			return _.pick(venue.venue,['name', 'location']);
		});
		tmpList[ll] = venues;
		return venues;
	}).catch((e)=>console.log(e));

	const rand = getRndInteger(0, restaurants.length - 1);
	return restaurants[rand];
}

// getRandomRestaurant('-6.1649353,106.79182650000001').then((restaurant)=>{
// 	console.log(restaurant);
// }).catch((e)=>console.log(e));

module.exports = {
	getRandomRestaurant
};
