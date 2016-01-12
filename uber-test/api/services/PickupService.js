var request = require('request');

exports.pickupLogin = function(code, callback){
	request
    .post('https://login.uber.com/oauth/v2/token?client_secret=yceyfAB_-wTeIj1OOyQaUE-1ZbD8LT13A3Y2okME&client_id=JFVitPjuNEKRNz3EGguzYiezSpasQLOk&grant_type=authorization_code&redirect_uri=https://52.74.30.237/user/pickupLogin&code='+code, function(err, httpResp, body){
      	if(err){
      		callback(err, null);
      	}else{
      		console.log(body);
      		// body.client_secret = 'CS0D2nvlx4_BRUry7GlrEjdP-Sh7sD7HNVP-Gr2g';
      		// body.client_id = 'XJyYPJd9aKwtIHRmnx_gEksS0VLQ1WHc';
      		callback(null, body);
      	}
    });
    
};

exports.requestRide = function(rideData, userCabToken, callback){
	request
	.post({
		url:'https://sandbox-api.uber.com/v1/requests',
		headers: {
			'Authorization': 'Bearer '+userCabToken,
			'Content-Type': 'application/json'
		},
		json: true,
		body: rideData
	},function(err, httpResp, body){
		callback(err, body);
	});
};

exports.getTimeEstimates = function(locationData, userCabToken, callback){
	request
	.get({
		url:'https://sandbox-api.uber.com/v1/estimates/time?start_latitude='+locationData.lat+'&start_longitude='+locationData.long,
		headers: {
			'Authorization': 'Bearer '+userCabToken
		}
	},function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
};

exports.cabStatus = function(rideId, token, callback){
	request
	.get({
		url: "https://sandbox-api.uber.com/v1/requests/"+rideId,
		headers: {
			'Authorization': 'Bearer '+token
		}
	}, function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
};

exports.getRideLink = function(rideId, token, callback){
	request
	.get({
		url: "https://sandbox-api.uber.com/v1/requests/"+rideId+"/map",
		headers: {
			'Authorization': 'Bearer '+token
		}
	}, function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
};

exports.cancelRide = function(rideId, token, callback){
	request
	.del({
		url: "https://sandbox-api.uber.com/v1/requests/"+rideId,
		headers: {
			'Authorization': 'Bearer '+token
		}
	}, function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
};

exports.getPriceEstimates = function(locationData, token, callback){
	request
	.get({
		url: "https://sandbox-api.uber.com/v1/estimates/price?start_latitude="+locationData.pickupLat+"&start_longitude="+locationData.pickuplong+"&end_latitude="+locationData.destlat+"&end_longitude="+locationData.destlong,
		headers: {
			'Authorization': 'Bearer '+token
		}
	}, function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
}